<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KidsModule extends Model
{
    protected $guarded = [];
    protected $table = 'kids_modules';
    public function progress() { return $this->hasMany(UserProgress::class, 'moduleId'); }
}
