<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SafeScapeProgress extends Model
{
    protected $guarded = [];
    protected $table = 'safescape_progress';
    public function user() { return $this->belongsTo(User::class, 'userId'); }
}
