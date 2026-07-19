<?php
// app/Models/GameProgress.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameProgress extends Model
{
    protected $table = 'game_progress';

    protected $fillable = [
        'user_id',
        'map1_unlocked',
    ];

    protected $casts = [
        'map1_unlocked' => 'boolean',
    ];
}
