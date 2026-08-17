<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['github_id', 'github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'assignee_id', 'base_branch', 'head_branch', 'task_id', 'closed_at', 'merged_at', 'merge_commit_sha'])]
#[Hidden(['merge_commit_sha'])]
class PullRequest extends Model
{
    use HasFactory;

    public function githubRepository(): BelongsTo
    {
        return $this->belongsTo(GithubRepository::class, 'github_repository_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function reviews()
    {
        return $this->hasMany(PullRequestReview::class, 'pull_request_id');
    }
}
