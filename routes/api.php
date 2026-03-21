<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\KidsController;
use App\Http\Controllers\FloorPlanController;
use App\Http\Controllers\EngagementController;
use App\Http\Controllers\AuthApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here we wire the 50+ Endpoints handling all 11 logical domains
|
*/

// ==========================================
// PUBLIC Routes (no auth required)
// ==========================================

// Auth API — used by registration wizard
Route::prefix('auth')->group(function () {
    Route::get('/check-username', [AuthApiController::class, 'checkUsername']);
    Route::post('/validate-credentials', [AuthApiController::class, 'validateCredentials']);
    Route::post('/register', [AuthApiController::class, 'register']);
});

// Public content — home page carousel, assessment questions for pre-test
Route::get('/content/carousel', [ContentController::class, 'carousel']);
Route::get('/assessment/questions', [AssessmentController::class, 'index']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// All protected API routes
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Auth Profile Completion
    Route::post('/auth/complete-profile', [AuthApiController::class, 'completeProfile']);
    Route::get('/auth/user-scores', [AuthApiController::class, 'userScores']);
    Route::put('/auth/update-profile', [AuthApiController::class, 'updateProfile']);
    Route::put('/auth/change-password', [AuthApiController::class, 'changePassword']);

    // ==========================================
    // 1. Content Domain (Blog, Videos, FAQs, Carousel)
    // ==========================================
    Route::prefix('content')->group(function () {
        Route::get('/blogs', [ContentController::class, 'blogs']);
        Route::get('/blogs/{id}', [ContentController::class, 'showBlog']);
        Route::get('/videos', [ContentController::class, 'videos']);
        Route::get('/questions', [ContentController::class, 'questions']);
        // Removed duplicate /carousel route as it needs to be public
    });

    // ==========================================
    // 2. Assessment Domain (Pre/Post tests, Scoring)
    // ==========================================
    Route::prefix('assessments')->group(function () {
        Route::get('/questions', [AssessmentController::class, 'index']);
        Route::post('/pre-test', [AssessmentController::class, 'submitPreTest']);
        Route::post('/post-test', [AssessmentController::class, 'submitPostTest']);
        Route::get('/history', [AssessmentController::class, 'history']);
    });

    // ==========================================
    // 3. Kids Domain (Modules, SafeScape Progress)
    // ==========================================
    Route::prefix('kids')->group(function () {
        Route::get('/modules', [KidsController::class, 'modules']);
        Route::get('/modules/{id}', [KidsController::class, 'showModule']);
        Route::post('/progress', [KidsController::class, 'updateProgress']);
        Route::get('/safescape', [KidsController::class, 'safeScapeProgress']);
        Route::post('/safescape', [KidsController::class, 'updateSafeScape']);
    });

    // ==========================================
    // 4. Floor Plan Simulation Domain
    // ==========================================
    Route::apiResource('floor-plans', FloorPlanController::class);
    Route::post('/floor-plans/{id}/clone', [FloorPlanController::class, 'clone']);
    Route::post('/floor-plans/{id}/simulate', [FloorPlanController::class, 'runSimulation']);
    Route::get('/floor-plans/{id}/status', [FloorPlanController::class, 'simulationStatus']);

    // ==========================================
    // 5. Engagement & Analytics Domain
    // ==========================================
    Route::prefix('engagement')->group(function () {
        Route::post('/log', [EngagementController::class, 'logEvent']);
        Route::get('/stats', [EngagementController::class, 'stats']);
        Route::get('/leaderboard', [EngagementController::class, 'leaderboard']);
        Route::get('/notifications', [EngagementController::class, 'notifications']);
        Route::post('/notifications/read', [EngagementController::class, 'readNotifications']);
    });

    // ==========================================
    // 6. Admin Control Panel (Role Protected)
    // ==========================================
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        // Analytics & Stats
        Route::get('/stats/overview', [AdminController::class, 'statsOverview']);
        Route::get('/stats/demographics', [AdminController::class, 'demographics']);
        
        // User Management CRUD
        Route::apiResource('users', AdminController::class);
        Route::post('/users/{id}/role', [AdminController::class, 'updateRole']);
        Route::post('/users/{id}/deactivate', [AdminController::class, 'deactivate']);
        
        // Content Management CRUD
        Route::apiResource('content/blogs', ContentController::class);
        Route::apiResource('content/videos', ContentController::class);
        Route::apiResource('content/questions', ContentController::class);
        Route::apiResource('content/carousel', ContentController::class);
        
        // Assessment Management CRUD
        Route::apiResource('assessments/questions', AssessmentController::class);
        
        // Reports
        Route::get('/reports/generate', [AdminController::class, 'generateReport']);
        Route::get('/reports/export', [AdminController::class, 'exportData']);
    });
});
