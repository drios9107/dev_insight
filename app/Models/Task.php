<?php

namespace App\Models;

use App\Concerns\LogsActivity;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $project_id
 * @property int|null $sprint_id
 * @property int|null $assignee_id
 * @property int $reporter_id
 * @property int|null $parent_task_id
 * @property string $status
 * @property string $priority
 * @property int|null $story_points
 * @property int|null $github_issue_id
 * @property Carbon|null $due_date
 * @property Carbon|null $completed_at
 * @property int|null $hours_estimate
 * @property int|null $hours_spent
 * @property int|null $order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Project|null $project
 * @property-read Sprint|null $sprint
 * @property-read GithubUser|null $assignee
 * @property-read User|null $reporter
 * @property-read GithubIssue|null $githubIssue
 * @property-read Collection<int, PullRequest> $pullRequests
 * @property-read Collection<int, Comment> $comments
 * @property-read Collection<int, ActivityLog> $activityLogs
 */
#[Fillable(['title', 'description', 'project_id', 'sprint_id', 'assignee_id', 'reporter_id', 'status', 'priority', 'story_points', 'github_issue_id', 'due_date', 'completed_at', 'hours_estimate', 'hours_spent', 'order'])]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory, LogsActivity;

    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<Sprint, $this>
     */
    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    /**
     * @return BelongsTo<GithubUser, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(GithubUser::class, 'assignee_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * @return BelongsTo<GithubIssue, $this>
     */
    public function githubIssue(): BelongsTo
    {
        return $this->belongsTo(GithubIssue::class, 'github_issue_id');
    }

    /**
     * @return HasMany<PullRequest, $this>
     */
    public function pullRequests(): HasMany
    {
        return $this->hasMany(PullRequest::class, 'task_id');
    }

    /**
     * @return HasMany<Comment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'task_id');
    }

    /**
     * @return HasMany<ActivityLog, $this>
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'task_id');
    }
}
