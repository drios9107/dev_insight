<?php

namespace App\Http\Resources;

use App\Models\Team;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read int $github_id
 * @property-read string $username
 * @property-read string|null $displayName
 * @property-read string|null $name
 * @property-read string|null $email
 * @property-read string|null $avatar
 * @property-read Carbon|null $last_synced_at
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read Collection<int, Team>|null $teams
 */
class GithubUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
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
                fn () => $this->teams->map(fn ($team) => [
                    'id' => $team->id,
                    'name' => $team->name,
                ])
            ),

            'last_synced_at' => $this->last_synced_at ? date('Y-m-d H:i', strtotime($this->last_synced_at)) : null,
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
