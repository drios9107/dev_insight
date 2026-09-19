<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['sha', 'github_repository_id', 'author_id', 'task_id', 'message', 'date', 'url'])]
class Commit extends Model
{
    use HasFactory;

    public function githubRepository()
    {
        return $this->belongsTo(GithubRepository::class);
    }

    public function author()
    {
        return $this->belongsTo(GithubUser::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
