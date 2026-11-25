<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('mail:test {email : Recipient email address}', function (string $email): int {
    Mail::raw('Mailtrap SMTP berhasil dikonfigurasi untuk CaBang.', function ($message) use ($email): void {
        $message->to($email)->subject('CaBang Mailtrap SMTP Test');
    });

    $this->info('Email sent. Check Mailtrap Email Sandbox.');

    return self::SUCCESS;
})->purpose('Send a Mailtrap SMTP test email');
