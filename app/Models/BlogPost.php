<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $guarded = [];
    protected $table = 'blog_posts';
    public function author() { return $this->belongsTo(User::class, 'authorId'); }
}
