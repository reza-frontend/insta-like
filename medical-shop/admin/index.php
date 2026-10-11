<?php
/* پوسته پنل مدیریت — تمام منطق در admin.js و api.php */
declare(strict_types=1);
require __DIR__ . '/lib.php';
security_headers();
header("Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'");
?><!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>پنل مدیریت</title>
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="admin.css">
<script src="../assets/js/icons.js" defer></script>
<script src="admin.js" defer></script>
</head>
<body>
<div id="app"><div class="boot">در حال بارگذاری...</div></div>
<noscript>برای استفاده از پنل مدیریت، جاوااسکریپت را فعال کنید.</noscript>
</body>
</html>
