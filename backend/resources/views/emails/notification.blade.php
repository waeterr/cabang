<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
</head>
<body style="margin:0;padding:32px 16px;background:#0B1020;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
        <tr>
            <td style="background:#11182B;border:1px solid rgba(255,255,255,0.14);border-radius:16px;padding:32px;">
                <p style="margin:0 0 4px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#8AB4FF;">CaBang</p>
                <h1 style="margin:0 0 16px;font-size:22px;color:#F4F7FC;">{{ $title }}</h1>
                <p style="margin:0 0 24px;color:#A5B1C5;line-height:1.6;">{{ $body }}</p>
                @if ($url)
                    <p style="margin:0;">
                        <a href="{{ $url }}" style="display:inline-block;padding:12px 22px;background:#8AB4FF;border-radius:10px;color:#0B1020;font-weight:600;text-decoration:none;">
                            Buka CaBang
                        </a>
                    </p>
                @endif
                <p style="margin:24px 0 0;color:#A5B1C5;font-size:12px;">
                    Email otomatis dari CaBang Perpustakaan UNDIP.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
