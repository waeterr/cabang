<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    /**
     * Mark the user email as verified from a signed link and redirect to the SPA.
     */
    public function verify(Request $request, string $id, string $hash)
    {
        $frontend = rtrim((string) config('mail.frontend_url'), '/');

        if (! $request->hasValidSignature()) {
            return redirect($frontend.'/login?verified=invalid');
        }

        $user = User::find($id);

        if (! $user || ! hash_equals(sha1($user->email), $hash)) {
            return redirect($frontend.'/login?verified=invalid');
        }

        if (! $user->email_verified_at) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return redirect($frontend.'/login?verified=1');
    }

    /**
     * Resend the email verification link.
     */
    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email sudah terverifikasi.',
            ], 422);
        }

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)],
        );

        Mail::to($user->email)->send(new VerifyEmailMail($user, $verificationUrl));

        return response()->json([
            'message' => 'Tautan verifikasi telah dikirim ulang.',
        ]);
    }
}
