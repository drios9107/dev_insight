<?php

namespace App\Models;

use App\Concerns\LogsDeletion;
use Database\Factories\PullRequestReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $github_id
 * @property int|null $reviewer_id
 * @property int $pull_request_id
 * @property string $state
 * @property string|null $body
 * @property Carbon|null $submitted_at
 * @property string|null $commit_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read GithubUser|null $reviewer
 * @property-read PullRequest|null $pullRequest
 * @property-read int $total_reviews
 * @property-read int $approved
 * @property-read int $changes_requested
 */
#[Fillable(['github_id', 'reviewer_id', 'pull_request_id', 'state', 'body', 'submitted_at'])]
class PullRequestReview extends Model
{
    /** @use HasFactory<PullRequestReviewFactory> */
    use HasFactory, LogsDeletion;

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<GithubUser, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(GithubUser::class, 'reviewer_id');
    }

    /**
     * @return BelongsTo<PullRequest, $this>
     */
    public function pullRequest(): BelongsTo
    {
        return $this->belongsTo(PullRequest::class, 'pull_request_id');
    }
}
