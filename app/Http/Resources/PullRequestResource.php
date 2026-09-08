<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PullRequestResource extends JsonResource
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
            'number' => $this->number,
            'title' => $this->title,
            'body' => $this->body,
            'state' => $this->state,
            'github_repository' => $this->whenLoaded('githubRepository', fn () => [
                'id' => $this->githubRepository->id,
                'name' => $this->githubRepository->name,
                'full_name' => $this->githubRepository->full_name,
            ]),
            'author' => $this->author,
            'assignees' => $this->whenLoaded('assignees', fn () => $this->assignees->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->displayName,
            ])
            ),
            'task' => $this->whenLoaded('task', fn () => [
                'id' => $this->task->id,
                'title' => $this->task->title,
            ]),
            'base_branch' => $this->base_branch,
            'head_branch' => $this->head_branch,
            'merge_commit_sha' => $this->merge_commit_sha,
            'closed_at' => $this->closed_at ? date('Y-m-d', strtotime($this->closed_at)) : null,
            'merged_at' => $this->merged_at ? date('Y-m-d', strtotime($this->merged_at)) : null,
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
