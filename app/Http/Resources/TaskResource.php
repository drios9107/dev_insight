<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'project' => $this->project,
            'sprint' => $this->sprint,
            'assignee' => $this->assignee,
            'github_issue' => $this->github_issue,
            'reporter' => $this->reporter,
            'status' => $this->status,
            'priority' => $this->priority,
            'story_points' => $this->story_points,
            'due_date' => (bool) $this->due_date ? date_format($this->due_date, 'Y-m-d') : '',
            'completed_at' => (bool) $this->completed_at ? date_format($this->completed_at, 'Y-m-d') : '',
            'hours_estimate' => $this->hours_estimate ?? 0,
            'hours_spent' => $this->hours_spent ?? 0,
            'order' => $this->order ?? 0,
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
