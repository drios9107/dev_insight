<?php

namespace App\Models;

use Database\Factories\GithubIssueFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
 * @property Carbon|null $closed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read GithubUser|null $author
 * @property-read Task|null $task
 * @property-read GithubRepository $githubRepository
 */
#[Fillable(['github_id', 'github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'closed_at'])]
class GithubIssue extends Model
{
    /** @use HasFactory<GithubIssueFactory> */
    use HasFactory;

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
     * @return HasOne<Task, $this>
     */
    public function task(): HasOne
    {
        return $this->hasOne(Task::class, 'github_issue_id');
    }
}
