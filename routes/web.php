<?php

use App\Http\Controllers\ProfileController;
use App\Models\BlogPost;
use App\Models\KidsModule;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/about', function () {
    return Inertia::render('About');
});

// Primary User Flow Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'admin') return redirect()->route('admin');
        if ($user->role === 'professional') return redirect()->route('professional');
        if ($user->role === 'kid') return redirect()->route('kids');
        return redirect()->route('adult');
    })->name('dashboard');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    Route::get('/kids', function () {
        $modules = KidsModule::where('isActive', true)->orderBy('dayNumber')->get();
        return Inertia::render('KidsDashboard', [
            'modules' => $modules,
        ]);
    })->name('kids');

    Route::get('/adult', function () {
        $blogs = BlogPost::with('author:id,name')->where('isPublished', true)->orderBy('created_at', 'desc')->get();
        return Inertia::render('AdultDashboard', [
            'initialBlogs' => $blogs,
        ]);
    })->name('adult');
    
    Route::get('/professional', function () {
        $blogs = BlogPost::with('author:id,name')->where('isPublished', true)->orderBy('created_at', 'desc')->get();
        return Inertia::render('AdultDashboard', [
            'initialBlogs' => $blogs,
        ]);
    })->name('professional');
    
    // Admin routing
    Route::middleware('admin')->group(function () {
        Route::get('/admin', function () {
            return Inertia::render('AdminDashboard');
        })->name('admin');
    });
});

require __DIR__.'/auth.php';

