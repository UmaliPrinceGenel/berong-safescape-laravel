<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $maintenance = null;
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('system_settings')) {
                $config = \App\Models\SystemSetting::getVal('maintenance_mode');
                if ($config && !empty($config['warning_active'])) {
                    $maintenance = [
                        'warning_message' => $config['warning_message'] ?? 'Notice: The platform will be offline for maintenance soon.',
                        'is_active' => !empty($config['is_active']),
                        'scheduled_at' => $config['scheduled_at'] ?? null
                    ];
                }
            }
        } catch (\Throwable $e) {
            // Silently fail if DB is down
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'maintenanceAlert' => $maintenance,
        ];
    }
}
