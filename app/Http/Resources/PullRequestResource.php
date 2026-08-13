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
            'github_repository' => $this->github_repository,
            'author' => $this->author,
            'assignee' => $this->assignee,
            'task' => $this->task,
            'base_branch' => $this->base_branch,
            'head_branch' => $this->head_branch,
            'merge_commit_sha' => $this->merge_commit_sha,
            'closed_at' => date_format($this->closed_at, 'Y-m-d'),
            'merged_at' => date_format($this->merged_at, 'Y-m-d'),
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
