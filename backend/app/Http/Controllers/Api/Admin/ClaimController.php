<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    /**
     * Display a listing of all claims.
     */
    public function index(Request $request)
    {
        $query = Claim::with(['report', 'user']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $claims = $query->latest()->paginate(15);

        return response()->json($claims);
    }

    /**
     * Get pending claims.
     */
    public function pending()
    {
        $claims = Claim::with(['report.user', 'user'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(15);

        return response()->json($claims);
    }

    /**
     * Display the specified claim.
     */
    public function show(string $id)
    {
        $claim = Claim::with(['report.user', 'user'])->findOrFail($id);

        return response()->json($claim);
    }

    /**
     * Approve claim.
     */
    public function approve(string $id)
    {
        $claim = Claim::findOrFail($id);

        // Update claim status
        $claim->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        // Update report status to resolved
        $claim->report->update([
            'status' => 'resolved',
        ]);

        return response()->json([
            'message' => 'Claim approved successfully',
            'claim' => $claim->load(['report', 'user']),
        ]);
    }

    /**
     * Reject claim.
     */
    public function reject(Request $request, string $id)
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        $claim = Claim::findOrFail($id);

        $claim->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Claim rejected',
            'claim' => $claim->load(['report', 'user']),
        ]);
    }

    /**
     * Remove the specified claim.
     */
    public function destroy(string $id)
    {
        $claim = Claim::findOrFail($id);
        $claim->delete();

        return response()->json([
            'message' => 'Claim deleted successfully',
        ]);
    }
}
