<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Report;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics.
     */
    public function stats()
    {
        $stats = [
            'users' => [
                'total' => User::where('role', 'student')->count(),
                'verified' => User::where('role', 'student')->where('is_verified', true)->count(),
                'pending_verification' => User::where('role', 'student')->where('verification_status', 'pending')->count(),
            ],
            'reports' => [
                'total' => Report::count(),
                'pending' => Report::where('status', 'pending')->count(),
                'approved' => Report::where('status', 'approved')->count(),
                'rejected' => Report::where('status', 'rejected')->count(),
                'resolved' => Report::where('status', 'resolved')->count(),
                'lost_items' => Report::where('type', 'lost')->count(),
                'found_items' => Report::where('type', 'found')->count(),
            ],
            'claims' => [
                'total' => Claim::count(),
                'pending' => Claim::where('status', 'pending')->count(),
                'approved' => Claim::where('status', 'approved')->count(),
                'rejected' => Claim::where('status', 'rejected')->count(),
            ],
        ];

        return response()->json($stats);
    }
}
