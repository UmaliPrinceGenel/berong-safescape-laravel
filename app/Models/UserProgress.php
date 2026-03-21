<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    protected $guarded = [];
    protected $table = 'user_progress';
    public function user() { return $this->belongsTo(User::class, 'userId'); }
    public function module() { return $this->belongsTo(KidsModule::class, 'moduleId'); }
}
