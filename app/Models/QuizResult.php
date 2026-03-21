<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    protected $guarded = [];
    protected $table = 'quiz_results';
    public function user() { return $this->belongsTo(User::class, 'userId'); }
}
