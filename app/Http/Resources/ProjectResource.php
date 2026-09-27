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
            'status' => $this->status,
            'color' => $this->color,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),

            'team' => $this->whenLoaded('team', fn() => $this->team ? [
                'id' => $this->team->id,
                'name' => $this->team->name,
            ] : null),

            'owner' => $this->whenLoaded('owner', fn() => $this->owner ? [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
                'avatar_url' => $this->owner->avatar_url,
            ] : null),

            'github_repository' => $this->whenLoaded('githubRepository', fn() => $this->githubRepository ? [
                'id' => $this->githubRepository->id,
                'name' => $this->githubRepository->name,
                'full_name' => $this->githubRepository->full_name,
            ] : null),

            'github_users_count' => $this->whenLoaded(
                'team',
                fn() =>
                $this->team?->githubUsers->count() ?? 0
            ),

            'tasks_count' => $this->whenCounted('tasks'),
            'sprints_count' => $this->whenCounted('sprints'),

            'progress' => $this->whenLoaded('tasks', function () {
                $total = $this->tasks->count();
                if ($total === 0) return 0;
                $done = $this->tasks->where('status', 'done')->count();
                return round(($done / $total) * 100, 1);
            }),

            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,

        ];
    }
}
