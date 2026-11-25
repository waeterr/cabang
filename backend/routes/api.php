<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClaimController;
use App\Http\Controllers\Api\ClaimMessageController;
use App\Http\Controllers\Api\InboxController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API CaBang - Sistem Barang Hilang UNDIP',
    ]);
});

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/stats', [DashboardController::class, 'stats']);
Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/{id}', [ReportController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/inbox', [InboxController::class, 'index']);
    Route::get('/inbox/unread-count', [InboxController::class, 'unreadCount']);
    Route::put('/inbox/read-all', [InboxController::class, 'markAllAsRead']);
    Route::put('/inbox/{id}/read', [InboxController::class, 'markAsRead']);
    Route::get('/activities/my', [InboxController::class, 'activities']);

    // Verified user routes
    Route::middleware('verified')->group(function () {
        // Reports
        Route::post('/reports', [ReportController::class, 'store']);
        Route::put('/reports/{id}', [ReportController::class, 'update']);
        Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
        Route::get('/reports/my/list', [ReportController::class, 'myReports']);

        // Claims
        Route::apiResource('claims', ClaimController::class);
        Route::get('/claims/my/list', [ClaimController::class, 'myClaims']);
        Route::get('/claims/{claimId}/messages', [ClaimMessageController::class, 'index']);
        Route::post('/claims/{claimId}/messages', [ClaimMessageController::class, 'store']);
    });

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // User management
        Route::get('/users/unverified', [UserController::class, 'unverified']);
        Route::post('/users/{id}/verify', [UserController::class, 'verify']);
        Route::post('/users/{id}/reject', [UserController::class, 'reject']);
        Route::put('/users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::put('/users/{id}/activate', [UserController::class, 'activate']);
        Route::apiResource('users', UserController::class);

        // Report management
        Route::get('/reports/pending/list', [App\Http\Controllers\Api\Admin\ReportController::class, 'pending']);
        Route::post('/reports/{id}/approve', [App\Http\Controllers\Api\Admin\ReportController::class, 'approve']);
        Route::post('/reports/{id}/reject', [App\Http\Controllers\Api\Admin\ReportController::class, 'reject']);
        Route::post('/reports/{id}/resolve', [App\Http\Controllers\Api\Admin\ReportController::class, 'resolve']);
        Route::apiResource('reports', App\Http\Controllers\Api\Admin\ReportController::class)->only(['index', 'show', 'store', 'destroy']);

        // Claim management
        Route::get('/claims/pending/list', [App\Http\Controllers\Api\Admin\ClaimController::class, 'pending']);
        Route::post('/claims/{id}/approve', [App\Http\Controllers\Api\Admin\ClaimController::class, 'approve']);
        Route::post('/claims/{id}/reject', [App\Http\Controllers\Api\Admin\ClaimController::class, 'reject']);
        Route::apiResource('claims', App\Http\Controllers\Api\Admin\ClaimController::class)->only(['index', 'show', 'destroy']);

        // Category management
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    });
});
