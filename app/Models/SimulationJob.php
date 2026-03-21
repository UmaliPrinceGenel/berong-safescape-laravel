<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimulationJob extends Model
{
    protected $guarded = [];
    protected $table = 'simulation_jobs';
    protected $casts = ['result' => 'array', 'config' => 'array'];
    public $incrementing = false;
    protected $keyType = 'string';
    public function user() { return $this->belongsTo(User::class, 'userId'); }
}
