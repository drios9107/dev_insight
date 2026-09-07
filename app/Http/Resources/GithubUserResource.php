<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GithubUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'github_id' => $this->github_id,
            'username' => $this->username,
            'email' => $this->email,
            'name' => $this->name,
            'avatar_url' => $this->avatar_url,
            'display_name' => $this->getDisplayName(),
            'commits_count' => $this->commits()->count(),
            'prs_count' => $this->authoredPullRequests()->count(),
            'issues_count' => $this->githubIssues()->count(),
            'reviews_count' => $this->pullRequestReviews()->count(),
            'last_synced_at' => $this->last_synced_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
