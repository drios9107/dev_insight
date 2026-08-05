<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'team_id', 'owner_id', 'github_repository_id', 'status', 'start_date', 'end_date', 'color'])]
class Project extends Model
{
    use HasFactory;

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function githubRepository()
    {
        return $this->belongsTo(GithubRepository::class);
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }

    public function metrics()
    {
        return $this->hasMany(Metric::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'project_id');
    }
}
