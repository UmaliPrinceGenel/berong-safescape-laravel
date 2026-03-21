<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentQuestion extends Model
{
    protected $guarded = [];
    protected $table = 'assessment_questions';
    protected $casts = ['options' => 'array', 'forRoles' => 'array'];
    public function userAnswers() { return $this->hasMany(UserAnswer::class, 'questionId'); }
}
