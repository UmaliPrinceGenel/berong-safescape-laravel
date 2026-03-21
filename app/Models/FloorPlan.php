<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FloorPlan extends Model
{
    protected $guarded = [];
    protected $table = 'floor_plans';
    protected $casts = ['gridData' => 'array'];
    public function user() { return $this->belongsTo(User::class, 'userId'); }
    public function clonedFrom() { return $this->belongsTo(FloorPlan::class, 'clonedFromId'); }
    public function clones() { return $this->hasMany(FloorPlan::class, 'clonedFromId'); }
}
