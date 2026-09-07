<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['github_id', 'github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'closed_at'])]
class GithubIssue extends Model
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
        return $this->hasOne(Task::class);
    }
}
