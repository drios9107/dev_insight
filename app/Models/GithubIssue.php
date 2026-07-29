<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['github_id', 'github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'task_id', 'closed_at'])]
class GithubIssue extends Model
{
    public function githubRepository()
    {
        return $this->belongsTo(GithubRepository::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
