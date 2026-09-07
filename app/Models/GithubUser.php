<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GithubUser extends Model
{
    use HasFactory;

    protected $table = 'github_users';

    protected $fillable = [
        'github_id',
        'username',
        'email',
        'name',
        'avatar_url',
    ];

    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class, 'author_id');
    }

    public function authoredPullRequests(): HasMany
    {
        return $this->hasMany(PullRequest::class, 'author_id');
    }

    public function assignedPullRequests(): BelongsToMany
    {
        return $this->belongsToMany(
            PullRequest::class,
            'pull_request_assignees',
            'github_user_id',
            'pull_request_id'
        );
    }

    public function githubIssues(): HasMany
    {
        return $this->hasMany(GithubIssue::class, 'author_id'); // ✅
    }

    public function pullRequestReviews(): HasMany
    {
        return $this->hasMany(PullRequestReview::class, 'reviewer_id'); // ✅
    }

    public function getAvatar(): string
    {
        return $this->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($this->username);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name ?? $this->username;
    }
}
