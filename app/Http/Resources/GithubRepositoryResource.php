<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
