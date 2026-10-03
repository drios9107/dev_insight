<?php

namespace App\Models;

use Database\Factories\PullRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $github_id
 * @property int $github_repository_id
 * @property int $number
 * @property string $title
 * @property string|null $body
 * @property string $state
 * @property int|null $author_id
 * @property int|null $task_id
 * @property string $base_branch
 * @property string $head_branch
 * @property Carbon|null $closed_at
 * @property Carbon|null $merged_at
 * @property string|null $merge_commit_sha
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read GithubRepository|null $githubRepository
 * @property-read GithubUser|null $author
 * @property-read Task|null $task
 * @property-read \Illuminate\Database\Eloquent\Collection<int, GithubUser> $assignees
 * @property-read \Illuminate\Database\Eloquent\Collection<int, PullRequestReview> $reviews
 * @property-read \Illuminate\Database\Eloquent\Collection<int, GithubUser> $reviewers
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Commit> $commits
 */
#[Fillable(['github_id', 'github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'base_branch', 'head_branch', 'task_id', 'closed_at', 'merged_at', 'merge_commit_sha'])]
#[Hidden(['merge_commit_sha'])]
class PullRequest extends Model
{
    /** @use HasFactory<PullRequestFactory> */
    use HasFactory;

    protected $casts = [
        'closed_at' => 'datetime',
        'merged_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<GithubRepository, $this>
     */
    public function githubRepository(): BelongsTo
    {
        return $this->belongsTo(GithubRepository::class, 'github_repository_id');
    }

    /**
     * @return BelongsTo<GithubUser, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(GithubUser::class, 'author_id');
    }

    /**
     * @return BelongsToMany<GithubUser, $this>
     */
    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(
            GithubUser::class,
            'pull_request_assignees',
            'pull_request_id',
            'github_user_id'
        );
    }

    /**
     * @return BelongsTo<Task, $this>
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    /**
     * @return HasMany<PullRequestReview, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(PullRequestReview::class, 'pull_request_id');
    }

    /**
     * @return HasManyThrough<GithubUser, PullRequestReview, $this>
     */
    public function reviewers(): HasManyThrough
    {
        return $this->hasManyThrough(
            GithubUser::class,
            PullRequestReview::class,
            'pull_request_id',
            'id',
            'id',
            'reviewer_id'
        );
    }

    /**
     * @return HasMany<Commit, $this>
     */
    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class, 'pull_request_id');
    }
}
