<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['github_id', 'name', 'full_name', 'url', 'description', 'is_private', 'default_branch', 'last_synced_at', 'project_id', 'webhook_secret'])]
#[Hidden(['webhook_secret'])]
class GithubRepository extends Model
{
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
