<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read int $github_id
 * @property-read string $name
 * @property-read string $full_name
 * @property-read string|null $url
 * @property-read string|null $description
 * @property-read bool $is_private
 * @property-read string|null $default_branch
 * @property-read Carbon|null $last_synced_at
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 */
class GithubRepositoryResource extends JsonResource
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
            'github_id' => $this->github_id,
            'name' => $this->name,
            'full_name' => $this->full_name,
            'url' => $this->url,
            'description' => $this->description,
            'is_private' => $this->is_private,
            'default_branch' => $this->default_branch,
            'last_synced_at' => $this->last_synced_at ? date('Y-m-d', strtotime($this->last_synced_at)) : null,
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
