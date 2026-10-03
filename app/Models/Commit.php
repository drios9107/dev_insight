<?php

namespace App\Models;

use Database\Factories\CommitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $sha
 * @property int $github_repository_id
 * @property int|null $author_id
 * @property string|null $message
 * @property Carbon|null $date
 * @property string $url
 * @property int|null $pull_request_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read GithubRepository $githubRepository
 * @property-read GithubUser|null $author
 * @property-read PullRequest|null $pullRequest
 *
 * @property-read int $count
 * @property-read string $week
 * @property-read int $total_commits
 * @property-read int $active_days
 * @property-read float|null $avg_commit_size
 */
#[Fillable(['sha', 'github_repository_id', 'author_id', 'message', 'date', 'url', 'pull_request_id'])]
class Commit extends Model
{
    /** @use HasFactory<CommitFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<GithubRepository, $this>
     */
    public function githubRepository(): BelongsTo
    {
        return $this->belongsTo(GithubRepository::class);
    }

    /**
     * @return BelongsTo<GithubUser, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(GithubUser::class, 'author_id');
    }

    /**
     * @return BelongsTo<PullRequest, $this>
     */
    public function pullRequest(): BelongsTo
    {
        return $this->belongsTo(PullRequest::class);
    }
}
