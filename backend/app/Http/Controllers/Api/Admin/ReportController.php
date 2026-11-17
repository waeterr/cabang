<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
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

        return response()->json([
            'message' => 'Report marked as resolved',
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
