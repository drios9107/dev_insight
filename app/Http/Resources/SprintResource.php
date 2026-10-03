<?php

namespace App\Http\Resources;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 *
 * @property-read int $id
 * @property-read string $name
 * @property-read string|null $goal
 * @property-read string $status
 * @property-read string|null $start_date
 * @property-read string|null $end_date
 * @property-read int|null $velocity
 * @property-read int|null $actual_velocity
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read Project|null $project
 * @property-read Collection<int, Task>|null $tasks
 */
class SprintResource extends JsonResource
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
            'goal' => $this->goal,

            'project' => $this->whenLoaded('project', fn() => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ]),

            'status' => $this->status,
            'start_date' => $this->start_date ? date('Y-m-d', strtotime($this->start_date)) : null,
            'end_date' => $this->end_date ? date('Y-m-d', strtotime($this->end_date)) : null,

            'velocity' => $this->velocity,
            'actual_velocity' => $this->actual_velocity,

            'tasks_by_status' => $this->whenLoaded('tasks', fn() => [
                'backlog' => $this->tasks->where('status', 'backlog')->count(),
                'todo' => $this->tasks->where('status', 'todo')->count(),
                'in_progress' => $this->tasks->where('status', 'in_progress')->count(),
                'review' => $this->tasks->where('status', 'review')->count(),
                'done' => $this->tasks->where('status', 'done')->count(),
            ]),

            'tasks_count' => $this->whenLoaded('tasks', fn() => $this->tasks->count()),
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
