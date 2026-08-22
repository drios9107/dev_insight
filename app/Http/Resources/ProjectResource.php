<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'team' => new TeamResource($this->team),
            'owner' => new UserResource($this->owner),
            'github_repository' => new GithubRepositoryResource($this->github_repository),
            'status' => $this->status,
            'color' => $this->color,
            'start_date' => (bool) $this->start_date ? date_format($this->start_date, 'Y-m-d') : '',
            'end_date' => (bool) $this->end_date ? date_format($this->end_date, 'Y-m-d') : '',
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
