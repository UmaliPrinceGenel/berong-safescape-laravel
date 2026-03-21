<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FireCodeSection extends Model
{
    protected $guarded = [];
    public function parentSection() { return $this->belongsTo(FireCodeSection::class, 'parentSectionId'); }
    public function subSections() { return $this->hasMany(FireCodeSection::class, 'parentSectionId'); }
}
