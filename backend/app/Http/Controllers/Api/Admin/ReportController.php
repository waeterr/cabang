<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of all reports.
     */
    public function index(Request $request)
    {
        $query = Report::with('user');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by archive state
        if ($request->input('archived') === 'only') {
            $query->whereNotNull('archived_at');
        } elseif (! $request->boolean('include_archived')) {
            $query->whereNull('archived_at');
        }

        $reports = $query->latest()->paginate(15);

        return response()->json($reports);
    }

    /**
     * Get pending reports.
     */
    public function pending()
    {
        $reports = Report::with('user')
            ->where('status', 'pending')
            ->latest()
            ->paginate(15);

        return response()->json($reports);
    }

    /**
     * Display the specified report.
     */
    public function show(string $id)
    {
        $report = Report::with(['user', 'claims.user'])->findOrFail($id);

        return response()->json($report);
    }

    /**
     * Approve report.
     */
    public function approve(string $id)
    {
        $report = Report::findOrFail($id);

        $report->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        ActivityLogger::log($report->user, 'report.approved', 'Laporan disetujui: '.$report->item_name, Report::class, $report->id);
        ActivityLogger::notify($report->user, 'report.approved', 'Laporan disetujui', 'Laporan kehilangan '.$report->item_name.' telah disetujui.', '/reports/my');

        return response()->json([
            'message' => 'Report approved successfully',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Reject report.
     */
    public function reject(Request $request, string $id)
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        $report = Report::findOrFail($id);

        $report->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        ActivityLogger::log($report->user, 'report.rejected', 'Laporan ditolak: '.$report->item_name, Report::class, $report->id);
        ActivityLogger::notify($report->user, 'report.rejected', 'Laporan ditolak', 'Laporan '.$report->item_name.' ditolak. Lihat alasan pada riwayat laporan.', '/reports/my');

        return response()->json([
            'message' => 'Report rejected',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Mark report as resolved.
     */
    public function resolve(string $id)
    {
        $report = Report::findOrFail($id);

        $report->update([
            'status' => 'resolved',
        ]);

        ActivityLogger::log($report->user, 'report.resolved', 'Laporan ditandai selesai: '.$report->item_name, Report::class, $report->id);
        ActivityLogger::notify($report->user, 'report.resolved', 'Laporan selesai', 'Laporan '.$report->item_name.' telah ditandai selesai.', '/reports/my');

        return response()->json([
            'message' => 'Report marked as resolved',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Store a new found item report (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'additional_info' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        // Store photo if provided
        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('reports', 'public');
        }

        // Admin creates found item reports; they are auto-approved
        $report = $request->user()->reports()->create([
            ...$validated,
            'type' => 'found',
            'status' => 'approved',
        ]);

        ActivityLogger::log(
            $request->user(),
            'report.found_created',
            'Mendaftarkan barang temuan: '.$report->item_name,
            Report::class,
            $report->id,
            ['item_name' => $report->item_name, 'type' => 'found'],
        );

        return response()->json([
            'message' => 'Found item report created successfully',
            'report' => $report->load('user'),
        ], 201);
    }

    /**
     * Archive the specified report. Archived reports leave the public list but
     * stay in the database and in the staff history.
     */
    public function archive(Request $request, string $id)
    {
        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $report = Report::findOrFail($id);

        $report->update([
            'archived_at' => now(),
        ]);

        $note = $validated['note'] ?? null;
        $description = 'Mengarsipkan laporan: '.$report->item_name;
        $message = 'Laporan '.$report->item_name.' telah diarsipkan oleh petugas perpustakaan.';
        if ($note) {
            $message .= ' Catatan: '.$note;
        }

        ActivityLogger::log($request->user(), 'report.archived', $description, Report::class, $report->id, ['note' => $note]);
        ActivityLogger::notify($report->user, 'report.archived', 'Laporan diarsipkan', $message, '/history');

        return response()->json([
            'message' => 'Report archived successfully',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Restore an archived report.
     */
    public function restore(Request $request, string $id)
    {
        $report = Report::findOrFail($id);
        $report->update(['archived_at' => null]);

        ActivityLogger::log($request->user(), 'report.restored', 'Mengembalikan laporan: '.$report->item_name, Report::class, $report->id);

        return response()->json([
            'message' => 'Report restored successfully',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Set a public removal notice on a found item report to inform visitors
     * that the item will be archived or disposed of if not claimed by the deadline.
     */
    public function setRemovalNotice(Request $request, string $id)
    {
        $validated = $request->validate([
            'deadline' => ['required', 'date', 'after:today'],
            'notice' => ['nullable', 'string', 'max:500'],
        ]);

        $report = Report::findOrFail($id);

        if ($report->type !== 'found') {
            return response()->json([
                'message' => 'Removal notices apply to found items only',
            ], 422);
        }

        $report->update([
            'removal_notice_at' => now(),
            'removal_deadline_at' => $validated['deadline'],
            'removal_notice' => $validated['notice'],
        ]);

        ActivityLogger::log(
            $request->user(),
            'report.removal_notice',
            'Mengumumkan penghapusan: '.$report->item_name,
            Report::class,
            $report->id,
            ['deadline' => $validated['deadline']],
        );

        return response()->json([
            'message' => 'Removal notice set successfully',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Clear the removal notice from a report.
     */
    public function clearRemovalNotice(Request $request, string $id)
    {
        $report = Report::findOrFail($id);

        $report->update([
            'removal_notice_at' => null,
            'removal_deadline_at' => null,
            'removal_notice' => null,
        ]);

        ActivityLogger::log(
            $request->user(),
            'report.removal_notice_cleared',
            'Membatalkan pengumuman penghapusan: '.$report->item_name,
            Report::class,
            $report->id,
        );

        return response()->json([
            'message' => 'Removal notice cleared',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Remove the specified report.
     */
    public function destroy(string $id)
    {
        $report = Report::findOrFail($id);
        $report->delete();

        return response()->json([
            'message' => 'Report deleted successfully',
        ]);
    }
}
