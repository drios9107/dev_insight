<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['project_id', 'team_id', 'date', 'commits_count', 'prs_opened', 'prs_closed', 'prs_merged', 'issues_opened', 'issues_closed', 'tasks_completed', 'tasks_in_progress', 'sprint_velocity', 'average_review_time', 'code_additions', 'code_deletions', 'active_developers'])]
class Metric extends Model
{
        use HasFactory;
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
