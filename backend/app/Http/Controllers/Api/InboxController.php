<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Notification;
use Illuminate\Http\Request;

class InboxController extends Controller
{
    /**
     * List notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $query = $request->user()->notifications()->latest();

        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        return response()->json([
            'data' => $query->paginate(min((int) $request->input('per_page', 15), 50)),
            'unread_count' => $request->user()->notifications()->unread()->count(),
        ]);
    }

    /**
     * Count unread notifications.
     */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'unread_count' => $request->user()->notifications()->unread()->count(),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()->unread()->update(['read_at' => now()]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * List activity history for the authenticated user.
     */
    public function activities(Request $request)
    {
        $activities = Activity::with('user:id,name,role')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(min((int) $request->input('per_page', 15), 50));

        return response()->json($activities);
    }
}
