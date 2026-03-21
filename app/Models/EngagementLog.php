<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngagementLog extends Model
{
    protected $guarded = [];
    protected $table = 'engagement_logs';
    protected $casts = ['eventData' => 'array'];
    public function user() { return $this->belongsTo(User::class, 'userId'); }
}
