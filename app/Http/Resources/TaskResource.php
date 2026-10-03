<?php

namespace App\Http\Resources;

use App\Models\GithubIssue;
use App\Models\GithubUser;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read string $title
 * @property-read string|null $description
 * @property-read string $status
 * @property-read string|null $priority
 * @property-read int|null $story_points
 * @property-read Carbon|null $due_date
 * @property-read Carbon|null $completed_at
 * @property-read int|null $hours_estimate
 * @property-read int|null $hours_spent
 * @property-read int|null $order
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read Project|null $project
 * @property-read Sprint|null $sprint
 * @property-read GithubUser|null $assignee
 * @property-read User|null $reporter
 * @property-read GithubIssue|null $githubIssue
 */
class TaskResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,

            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ]),

            'sprint' => $this->whenLoaded('sprint', fn() => $this->sprint ? [
                'id' => $this->sprint->id,
                'name' => $this->sprint->name,
            ] : null),

            'assignee' => $this->whenLoaded('assignee', fn() => $this->assignee ? [
                'id' => $this->assignee->id,
                'username' => $this->assignee->username,
                'display_name' => $this->assignee->displayName,
                'avatar' => $this->assignee->avatar,
            ] : null),

            'reporter' => $this->whenLoaded('reporter', fn() => $this->reporter ? [
                'id' => $this->reporter->id,
                'name' => $this->reporter->name,
                'avatar' => $this->reporter->avatar_url,
            ] : null),

            'github_issue' => $this->whenLoaded('githubIssue', fn() => $this->githubIssue ? [
                'id' => $this->githubIssue->id,
                'number' => $this->githubIssue->number,
                'title' => $this->githubIssue->title,
                'state' => $this->githubIssue->state,
            ] : null),

            'status' => $this->status,
            'priority' => $this->priority,
            'story_points' => $this->story_points,
            'due_date' => $this->due_date ? date('Y-m-d', strtotime($this->due_date)) : null,
            'completed_at' => $this->completed_at ? date('Y-m-d', strtotime($this->completed_at)) : null,
            'hours_estimate' => $this->hours_estimate ?? 0,
            'hours_spent' => $this->hours_spent ?? 0,
            'order' => $this->order ?? 0,
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,

        ];
    }
}
