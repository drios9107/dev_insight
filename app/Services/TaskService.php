<?php

namespace App\Services;

use App\Enums\TaskStatusEnum;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskService
{
    public function index(?Request $request = null)
    {
        $query = Task::query();

        if ($request && $request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('assignee', function ($a) use ($search) {
                        $a->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('reporter', function ($r) use ($search) {
                        $r->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('sprint', function ($s) use ($search) {
                        $s->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request && $request->boolean('overdue')) {
            $query->where('due_date', '<', now())
                ->whereNotIn('status', ['done', 'cancelled']);
        }

        if ($request && $request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request && $request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request && $request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request && $request->filled('assignee_id')) {
            $query->where('assignee_id', $request->assignee_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Task::create($this->updateStatus($data)) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Task
     */
    public function show($id)
    {
        $item = Task::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        $updated = $this->updateStatus($data);
        return Task::whereId($id)->update($updated) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Task::destroy($id) !== null;
    }

    /**
     * When the status is done the 'completed_at' field takes the current date and time, with any other value completed value is cleared
     * @param array $data
     * @return $data
     */
    private function updateStatus(array $data)
    {
        if ($data['status'] === TaskStatusEnum::Done->value) {
            $data['completed_at'] = now();
        } else
            $data['completed_at'] = null;

        return $data;
    }
}
