<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAnswer extends Model
{
    protected $guarded = [];
    protected $table = 'user_answers';
    public $timestamps = false;
    public function user() { return $this->belongsTo(User::class, 'userId'); }
    public function question() { return $this->belongsTo(AssessmentQuestion::class, 'questionId'); }
}

