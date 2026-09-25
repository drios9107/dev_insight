<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'avatar_url' => $this->avatar_url,
            'is_active' => $this->is_active,
            'owner' => $this->whenLoaded('owner', fn() => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
            ]),
            'github_users' => $this->whenLoaded(
                'githubUsers',
                fn() =>
                $this->githubUsers->map(fn($user) => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'display_name' => $user->displayName,
                    'avatar' => $user->avatar,
                ])
            ),
            'github_users_count' => $this->whenLoaded('githubUsers', fn() => $this->githubUsers->count()),
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
