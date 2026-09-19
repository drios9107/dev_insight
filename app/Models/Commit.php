<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['sha', 'github_repository_id', 'author_id', 'message', 'date', 'url', 'pull_request_id'])]
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

    public function pullRequest(): BelongsTo
    {
        return $this->belongsTo(PullRequest::class);
    }
}
