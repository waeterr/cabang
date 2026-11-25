<?php

namespace App\Services;

use App\Mail\NotificationMail;
use App\Models\Activity;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Throwable;

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
        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'link' => $link,
        ]);

        Mail::to($user->email)->send(new NotificationMail(
            $title,
            $body,
            $link ? rtrim((string) config('mail.frontend_url'), '/').$link : null,
        ));

        return $notification;
    }

    /**
     * Notify every admin account about a student action that needs attention.
     * Failures are swallowed so that a mail transport problem never blocks the
     * student's request.
     */
    public static function notifyAdmins(string $type, string $title, string $body, ?string $link = null): void
    {
        User::where('role', 'admin')
            ->get()
            ->each(function (User $admin) use ($type, $title, $body, $link): void {
                try {
                    self::notify($admin, $type, $title, $body, $link);
                } catch (Throwable $exception) {
                    report($exception);
                }
            });
    }
}
