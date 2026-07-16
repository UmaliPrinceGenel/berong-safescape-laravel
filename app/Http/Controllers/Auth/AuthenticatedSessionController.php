<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('AuthPage', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // 1. Validate credentials manually first without logging in
        $user = \App\Models\User::where('username', $request->input('username'))->first();
        if (!$user || !\Illuminate\Support\Facades\Hash::check($request->input('password'), $user->password)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'username' => trans('auth.failed'),
            ]);
        }

        // 2. Check if an active session exists in the database
        $activeSessionExists = \Illuminate\Support\Facades\DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('last_activity', '>=', now()->subMinutes(config('session.lifetime'))->getTimestamp())
            ->exists();

        if ($activeSessionExists && !$request->boolean('confirm_overwrite')) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'session_conflict' => 'This account is currently active on another device. Logging in here will sign you out of that device.'
            ]);
        }

        // 3. If there is an active session and they confirmed, terminate it
        if ($activeSessionExists) {
            \Illuminate\Support\Facades\DB::table('sessions')->where('user_id', $user->id)->delete();
        }

        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
