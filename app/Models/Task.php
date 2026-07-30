<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'description', 'project_id', 'sprint_id', 'assignee_id', 'reporter_id', 'status', 'priority', 'story_points', 'github_issue_id', 'due_date', 'completed_at', 'hours_estimate', 'hours_spent', 'order'])]
class Task extends Model
{
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class);
    }

    public function github_issue()
    {
        return $this->belongsTo(GithubIssue::class);
    }

    public function commits()
    {
        return $this->hasMany(Commit::class, 'task_id');
    }

    public function pullRequests()
    {
        return $this->hasMany(PullRequest::class, 'task_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'task_id');
    }
}
