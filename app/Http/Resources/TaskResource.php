<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,

            'project' => $this->whenLoaded('project', fn () => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ]),

            'sprint' => $this->whenLoaded('sprint', fn () => $this->sprint ? [
                'id' => $this->sprint->id,
                'name' => $this->sprint->name,
            ] : null),

            'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee ? [
                'id' => $this->assignee->id,
                'username' => $this->assignee->username,
                'display_name' => $this->assignee->displayName,
                'avatar' => $this->assignee->avatar,
            ] : null),

            'reporter' => $this->whenLoaded('reporter', fn () => $this->reporter ? [
                'id' => $this->reporter->id,
                'name' => $this->reporter->name,
                'avatar' => $this->reporter->avatar_url,
            ] : null),

            'github_issue' => $this->whenLoaded('githubIssue', fn () => $this->githubIssue ? [
                'id' => $this->githubIssue->id,
                'number' => $this->githubIssue->number,
                'title' => $this->githubIssue->title,
                'state' => $this->githubIssue->state,
            ] : null),

            'status' => $this->status,
            'priority' => $this->priority,
            'story_points' => $this->story_points,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'completed_at' => $this->completed_at?->format('Y-m-d'),
            'hours_estimate' => $this->hours_estimate ?? 0,
            'hours_spent' => $this->hours_spent ?? 0,
            'order' => $this->order ?? 0,
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,

        ];
    }
}
