<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsCache extends Model
{
    protected $guarded = [];
    protected $table = 'analytics_cache';
    protected $casts = ['cacheData' => 'array'];
}
