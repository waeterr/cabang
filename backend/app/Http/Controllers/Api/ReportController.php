<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * Display a listing of approved reports.
     */
    public function index(Request $request)
    {
        $query = Report::with('user')
            ->approved();

        // Filter by type (lost/found)
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', '%'.$request->location.'%');
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Search by item name
        if ($request->has('search')) {
            $query->where('item_name', 'like', '%'.$request->search.'%');
        }

        $reports = $query->latest()->paginate(min((int) $request->input('per_page', 15), 50));

        return response()->json($reports);
    }

    /**
     * Store a newly created report.
     */
    public function store(Request $request)
    {
        // Students may only create lost reports. Found items are registered by
        // library staff through the admin endpoint.
        if ($request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin tidak dapat membuat laporan kehilangan. Gunakan formulir barang temuan.',
            ], 403);
        }

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

        // Students can only report lost items. Found items are registered by
        // library staff through the admin endpoint.
        $report = $request->user()->reports()->create([
            ...$validated,
            'type' => 'lost',
            'status' => 'pending',
        ]);

        ActivityLogger::log(
            $request->user(),
            'report.created',
            'Membuat laporan kehilangan: '.$report->item_name,
            Report::class,
            $report->id,
            ['item_name' => $report->item_name, 'type' => 'lost', 'status' => 'pending'],
        );
        ActivityLogger::notifyAdmins(
            'report.pending',
            'Laporan kehilangan baru',
            $request->user()->name.' melaporkan kehilangan '.$report->item_name.'.',
            '/admin/reports',
        );

        return response()->json([
            'message' => 'Report created successfully. Waiting for admin approval.',
            'report' => $report->load('user'),
        ], 201);
    }

    /**
     * Display the specified report.
     */
    public function show(string $id)
    {
        $report = Report::with('user')
            ->approved()
            ->findOrFail($id);

        return response()->json($report);
    }

    /**
     * Update the specified report.
     */
    public function update(Request $request, string $id)
    {
        $report = Report::findOrFail($id);

        // Only allow owner to update
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Only allow update if pending or rejected
        if (! in_array($report->status, ['pending', 'rejected'])) {
            return response()->json([
                'message' => 'Cannot update approved or resolved report',
            ], 422);
        }

        $validated = $request->validate([
            'item_name' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'location' => ['sometimes', 'string', 'max:255'],
            'date' => ['sometimes', 'date'],
            'additional_info' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        // Store new photo if provided
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($report->photo_path) {
                Storage::disk('public')->delete($report->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('reports', 'public');
        }

        // Reset status to pending on update
        $validated['status'] = 'pending';
        $validated['rejection_reason'] = null;

        $report->update($validated);

        return response()->json([
            'message' => 'Report updated successfully',
            'report' => $report->load('user'),
        ]);
    }

    /**
     * Remove the specified report.
     */
    public function destroy(Request $request, string $id)
    {
        $report = Report::findOrFail($id);

        // Only allow owner to delete
        if ($report->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Only allow delete if pending or rejected
        if (! in_array($report->status, ['pending', 'rejected'])) {
            return response()->json([
                'message' => 'Cannot delete approved or resolved report',
            ], 422);
        }

        // Delete photo if exists
        if ($report->photo_path) {
            Storage::disk('public')->delete($report->photo_path);
        }

        $report->delete();

        return response()->json([
            'message' => 'Report deleted successfully',
        ]);
    }

    /**
     * Get user's own reports.
     */
    public function myReports(Request $request)
    {
        $reports = $request->user()
            ->reports()
            ->latest()
            ->paginate(15);

        return response()->json($reports);
    }
}
