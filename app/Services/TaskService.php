<?php

namespace App\Services;

use App\Enums\TaskStatusEnum;
use App\Models\Task;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class TaskService
{
    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, Task>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Task::query()
            ->with([
                'project',
                'sprint',
                'assignee',
                'reporter',
            ]);

        if ($request?->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('assignee', function ($a) use ($search) {
                        $a->where('username', 'ilike', $search)
                            ->orWhere('name', 'ilike', $search);
                    })
                    ->orWhereHas('reporter', function ($r) use ($search) {
                        $r->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('sprint', function ($s) use ($search) {
                        $s->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request?->boolean('overdue')) {
            $query->where('due_date', '<', now())
                ->whereNotIn('status', ['done', 'cancelled']);
        }

        if ($request?->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request?->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request?->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request?->filled('assignee_id')) {
            $query->where('assignee_id', $request->assignee_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Task
    {
        return Task::create($data);
    }

    /**
     * Display the specified item.
     */
    public function show(int $id): Task
    {
        return Task::with([
            'project',
            'sprint',
            'assignee',
            'reporter',
            'githubIssue',
        ])->findOrFail($id);
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        $updated = $this->updateStatus($data);

        return Task::findOrFail($id)->update($updated);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Task::destroy($id) > 0;
    }

    /**
     * When the status is done the 'completed_at' field takes the current date and time,
     * with any other value completed value is cleared.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function updateStatus(array $data): array
    {
        if ($data['status'] === TaskStatusEnum::Done->value) {
            $data['completed_at'] = now();
        } else {
            $data['completed_at'] = null;
        }

        return $data;
    }

    /**
     * @param  array<int, int|string>  $ids
     */
    public function bulkDestroy(array $ids): int
    {
        $items = Task::whereIn('id', $ids)->get();

        $count = 0;

        foreach ($items as $i) {
            $i->delete();
            $count++;
        }

        return $count;
    }
}
