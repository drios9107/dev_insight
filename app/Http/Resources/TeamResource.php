<?php

namespace App\Http\Resources;

use App\Models\GithubUser;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string|null $description
 * @property-read bool $is_active
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read User|null $owner
 * @property-read Collection<int, GithubUser>|null $githubUsers
 */
class TeamResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'owner' => $this->whenLoaded('owner', fn() => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
            ]),
            'github_users' => $this->whenLoaded(
                'githubUsers',
                fn() => $this->githubUsers->map(fn($user) => [
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
