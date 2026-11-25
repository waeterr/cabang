<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Verifikasi Email</title>
</head>
<body style="margin:0;padding:32px 16px;background:#0B1020;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
        <tr>
            <td style="background:#11182B;border:1px solid rgba(255,255,255,0.14);border-radius:16px;padding:32px;">
                <p style="margin:0 0 4px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#8AB4FF;">CaBang</p>
                <h1 style="margin:0 0 16px;font-size:24px;color:#F4F7FC;">Verifikasi email Anda</h1>
                <p style="margin:0 0 12px;color:#A5B1C5;line-height:1.6;">
                    Halo {{ $user->name }}, terima kasih telah mendaftar di CaBang Perpustakaan UNDIP.
                </p>
                <p style="margin:0 0 24px;color:#A5B1C5;line-height:1.6;">
                    Klik tombol di bawah untuk memverifikasi alamat email <strong style="color:#F4F7FC;">{{ $user->email }}</strong>.
                </p>
                <p style="margin:0 0 24px;">
                    <a href="{{ $verificationUrl }}" style="display:inline-block;padding:13px 24px;background:#8AB4FF;border-radius:10px;color:#0B1020;font-weight:600;text-decoration:none;">
                        Verifikasi Email
                    </a>
                </p>
                <p style="margin:0;color:#A5B1C5;font-size:13px;line-height:1.6;">
                    Jika tombol tidak berfungsi, salin tautan berikut ke browser:<br>
                    <span style="color:#67E8F9;word-break:break-all;">{{ $verificationUrl }}</span>
                </p>
                <p style="margin:24px 0 0;color:#A5B1C5;font-size:12px;">
                    Abaikan email ini jika Anda tidak merasa mendaftar.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
