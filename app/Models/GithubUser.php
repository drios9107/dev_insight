<?php

namespace App\Models;

use Database\Factories\GithubUserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $github_id
 * @property string $username
 * @property string|null $email
 * @property string|null $name
 * @property string|null $avatar_url
 * @property Carbon|null $last_synced_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $display_name
 * @property-read string $avatar
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Team> $teams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Commit> $commits
 * @property-read \Illuminate\Database\Eloquent\Collection<int, PullRequest> $authoredPullRequests
 * @property-read \Illuminate\Database\Eloquent\Collection<int, PullRequest> $assignedPullRequests
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Task> $assignedTasks
 * @property-read \Illuminate\Database\Eloquent\Collection<int, GithubIssue> $githubIssues
 * @property-read \Illuminate\Database\Eloquent\Collection<int, PullRequestReview> $pullRequestReviews
 */
class GithubUser extends Model
{
    /** @use HasFactory<GithubUserFactory> */
    use HasFactory;

    protected $table = 'github_users';

    protected $fillable = [
        'github_id',
        'username',
        'email',
        'name',
        'avatar_url',
        'last_synced_at',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
    ];

    /**
     * @return BelongsToMany<Team, $this>
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(
            Team::class,
            'team_github_user',
            'github_user_id',
            'team_id'
        );
    }

    /**
     * @return HasMany<Commit, $this>
     */
    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class, 'author_id');
    }

    /**
     * @return HasMany<PullRequest, $this>
     */
    public function authoredPullRequests(): HasMany
    {
        return $this->hasMany(PullRequest::class, 'author_id');
    }

    /**
     * @return BelongsToMany<PullRequest, $this>
     */
    public function assignedPullRequests(): BelongsToMany
    {
        return $this->belongsToMany(
            PullRequest::class,
            'pull_request_assignees',
            'github_user_id',
            'pull_request_id'
        );
    }

    /**
     * @return HasMany<Task, $this>
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }

    /**
     * @return HasMany<GithubIssue, $this>
     */
    public function githubIssues(): HasMany
    {
        return $this->hasMany(GithubIssue::class, 'author_id');
    }

    /**
     * @return HasMany<PullRequestReview, $this>
     */
    public function pullRequestReviews(): HasMany
    {
        return $this->hasMany(PullRequestReview::class, 'reviewer_id');
    }

    public function getAvatar(): string
    {
        return $this->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->username);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name ?? $this->username;
    }
}
