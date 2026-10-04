<?php

namespace App\Models;

use Database\Factories\GithubRepositoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $github_id
 * @property string $name
 * @property string $full_name
 * @property string $url
 * @property string|null $description
 * @property bool $is_private
 * @property string $default_branch
 * @property string|null $language
 * @property int $stars_count
 * @property int $forks_count
 * @property Carbon|null $last_synced_at
 * @property string|null $webhook_secret
 * @property int|null $project_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Project|null $project
 * @property-read Collection<int, GithubIssue> $githubIssues
 * @property-read Collection<int, Commit> $commits
 * @property-read Collection<int, PullRequest> $pullRequests
 */
#[Fillable(['github_id', 'name', 'full_name', 'url', 'description', 'is_private', 'default_branch', 'last_synced_at', 'webhook_secret'])]
#[Hidden(['webhook_secret'])]
class GithubRepository extends Model
{
    /** @use HasFactory<GithubRepositoryFactory> */
    use HasFactory;

    protected $casts = [
        'is_private' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * @return HasOne<Project, $this>
     */
    public function project(): HasOne
    {
        return $this->hasOne(Project::class, 'github_repository_id');
    }

    /**
     * @return HasMany<GithubIssue, $this>
     */
    public function githubIssues(): HasMany
    {
        return $this->hasMany(GithubIssue::class, 'github_repository_id');
    }

    /**
     * @return HasMany<Commit, $this>
     */
    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class, 'github_repository_id');
    }

    /**
     * @return HasMany<PullRequest, $this>
     */
    public function pullRequests(): HasMany
    {
        return $this->hasMany(PullRequest::class, 'github_repository_id');
    }
}
