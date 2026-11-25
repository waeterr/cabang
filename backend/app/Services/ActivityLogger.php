<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Notification;
use App\Models\User;

class ActivityLogger
{
    /**
     * Record an activity entry.
     *
     * @param  array<string, mixed>  $meta
     */
    public static function log(?User $user, string $action, string $description, ?string $subjectType = null, ?int $subjectId = null, array $meta = []): Activity
    {
        return Activity::create([
            'user_id' => $user?->id,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'description' => $description,
            'meta' => $meta,
        ]);
    }

    /**
     * Send an in-app notification to a user.
     */
    public static function notify(User $user, string $type, string $title, string $body, ?string $link = null): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'link' => $link,
        ]);
    }
}
