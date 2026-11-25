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
