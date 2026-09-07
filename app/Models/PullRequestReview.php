<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['github_id', 'reviewer_id', 'pull_request_id', 'state', 'body', 'submitted_at'])]
class PullRequestReview extends Model
{
    use HasFactory;

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(GithubUser::class, 'reviewer_id');
    }

    public function pullRequest(): BelongsTo
    {
        return $this->belongsTo(PullRequest::class, 'pull_request_id');
    }
}
