<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'team_id', 'owner_id', 'github_repository_id', 'status', 'start_date', 'end_date', 'color'])]
#[Hidden(['github_repository_id'])]
class Project extends Model
{
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
        return $this->hasOne(GithubRepository::class);
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class);
    }
}
