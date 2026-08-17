<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['github_id', 'name', 'full_name', 'url', 'description', 'is_private', 'default_branch', 'last_synced_at', 'webhook_secret'])]
#[Hidden(['webhook_secret'])]
class GithubRepository extends Model
{
    use HasFactory;

    public function project()
    {
        return $this->hasOne(Project::class);
    }

    public function githubIssues()
    {
        return $this->hasMany(GithubIssue::class, 'github_repository_id');
    }

    public function commits()
    {
        return $this->hasMany(Commit::class, 'github_repository_id');
    }

    public function pullRequests()
    {
        return $this->hasMany(PullRequest::class, 'github_repository_id');
    }
}
