<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Report;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClaimController extends Controller
{
    /**
     * Display a listing of the resource (admin only).
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
     * Store a newly created claim.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_id' => ['required', 'exists:reports,id'],
            'proof_description' => ['required', 'string'],
            'proof_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'contact_info' => ['required', 'string', 'max:255'],
        ]);

        // Check if report exists and is a found item
        $report = Report::findOrFail($validated['report_id']);

        if ($report->type !== 'found') {
            return response()->json([
                'message' => 'You can only claim found items',
            ], 422);
        }

        if ($report->status !== 'approved') {
            return response()->json([
                'message' => 'You can only claim approved reports',
            ], 422);
        }

        // Check if user already claimed this report
        $existingClaim = Claim::where('report_id', $validated['report_id'])
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($existingClaim) {
            return response()->json([
                'message' => 'You have already claimed this item',
            ], 422);
        }

        // Store proof file if provided
        if ($request->hasFile('proof_file')) {
            $validated['proof_path'] = $request->file('proof_file')->store('claims', 'public');
        }

        $claim = Claim::create([
            'report_id' => $validated['report_id'],
            'user_id' => $request->user()->id,
            'proof_description' => $validated['proof_description'],
            'proof_path' => $validated['proof_path'] ?? null,
            'contact_info' => $validated['contact_info'],
            'status' => 'pending',
        ]);

        ActivityLogger::log(
            $request->user(),
            'claim.created',
            'Mengajukan klaim: '.$report->item_name,
            Claim::class,
            $claim->id,
            ['item_name' => $report->item_name, 'status' => 'pending'],
        );

        return response()->json([
            'message' => 'Claim submitted successfully. Waiting for admin approval.',
            'claim' => $claim->load(['report', 'user']),
        ], 201);
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
     * Update the specified claim.
     */
    public function update(Request $request, string $id)
    {
        $claim = Claim::findOrFail($id);

        // Only allow owner to update
        if ($claim->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Only allow update if pending or rejected
        if (! in_array($claim->status, ['pending', 'rejected'])) {
            return response()->json([
                'message' => 'Cannot update approved claim',
            ], 422);
        }

        $validated = $request->validate([
            'proof_description' => ['sometimes', 'string'],
            'proof_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'contact_info' => ['sometimes', 'string', 'max:255'],
        ]);

        // Store new proof file if provided
        if ($request->hasFile('proof_file')) {
            // Delete old proof file
            if ($claim->proof_path) {
                Storage::disk('public')->delete($claim->proof_path);
            }
            $validated['proof_path'] = $request->file('proof_file')->store('claims', 'public');
        }

        // Reset status to pending on update
        $validated['status'] = 'pending';
        $validated['rejection_reason'] = null;

        $claim->update($validated);

        return response()->json([
            'message' => 'Claim updated successfully',
            'claim' => $claim->load(['report', 'user']),
        ]);
    }

    /**
     * Remove the specified claim.
     */
    public function destroy(Request $request, string $id)
    {
        $claim = Claim::findOrFail($id);

        // Only allow owner to delete
        if ($claim->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Only allow delete if pending or rejected
        if (! in_array($claim->status, ['pending', 'rejected'])) {
            return response()->json([
                'message' => 'Cannot delete approved claim',
            ], 422);
        }

        // Delete proof file if exists
        if ($claim->proof_path) {
            Storage::disk('public')->delete($claim->proof_path);
        }

        $claim->delete();

        return response()->json([
            'message' => 'Claim deleted successfully',
        ]);
    }

    /**
     * Get user's own claims.
     */
    public function myClaims(Request $request)
    {
        $claims = $request->user()
            ->claims()
            ->with('report')
            ->latest()
            ->paginate(15);

        return response()->json($claims);
    }
}
