<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = ['key', 'value', 'description'];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Get a setting value by key (cached for 30s).
     */
    public static function getVal(string $key, $default = null)
    {
        return \Illuminate\Support\Facades\Cache::remember("system_setting_{$key}", 30, function () use ($key, $default) {
            try {
                $setting = self::where('key', $key)->first();
                return $setting ? $setting->value : $default;
            } catch (\Throwable $e) {
                return $default;
            }
        });
    }

    /**
     * Set a setting value by key and invalidate cache.
     */
    public static function setVal(string $key, $value, ?string $description = null)
    {
        \Illuminate\Support\Facades\Cache::forget("system_setting_{$key}");
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'description' => $description]
        );
    }
}
