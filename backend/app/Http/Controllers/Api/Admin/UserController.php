<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'student');

        // Filter by verification status
        if ($request->has('verification_status')) {
            $query->where('verification_status', $request->verification_status);
        }

        // Search by name, NIM, or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('nim', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            });
        }

        $users = $query->latest()->paginate(15);

        return response()->json($users);
    }

    /**
     * Get unverified users.
     */
    public function unverified()
    {
        $users = User::where('role', 'student')
            ->where('verification_status', 'pending')
            ->latest()
            ->paginate(15);

        return response()->json($users);
    }

    /**
     * Display the specified user.
     */
    public function show(string $id)
    {
        $user = User::with(['reports', 'claims'])->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Verify user KTM.
     */
    public function verify(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_verified' => true,
            'verification_status' => 'approved',
            'rejection_reason' => null,
        ]);

        return response()->json([
            'message' => 'User verified successfully',
            'user' => $user,
        ]);
    }

    /**
     * Reject user KTM verification.
     */
    public function reject(Request $request, string $id)
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'is_verified' => false,
            'verification_status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'User verification rejected',
            'user' => $user,
        ]);
    }

    /**
     * Deactivate user account.
     */
    public function deactivate(string $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_verified' => false,
            'verification_status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'User deactivated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Activate user account.
     */
    public function activate(string $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_verified' => true,
            'verification_status' => 'approved',
        ]);

        return response()->json([
            'message' => 'User activated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Cannot delete admin user',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
