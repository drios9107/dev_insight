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
            'display_name' => $this->displayName,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,

            'commits_count' => $this->whenCounted('commits'),
            'prs_count' => $this->whenCounted('authoredPullRequests'),
            'reviews_count' => $this->whenCounted('pullRequestReviews'),
            'issues_count' => $this->whenCounted('githubIssues'),

            'teams' => $this->whenLoaded(
                'teams',
                fn() =>
                $this->teams->map(fn($team) => [
                    'id' => $team->id,
                    'name' => $team->name,
                ])
            ),

            'last_synced_at' => $this->last_synced_at ? date('Y-m-d H:i:s', strtotime($this->last_synced_at)) : null,
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
