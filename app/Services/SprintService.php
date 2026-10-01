<?php

namespace App\Services;

use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

class SprintService
{
    public function index(?Request $request = null)
    {
        $query = Sprint::query()
            ->with(['project']);

        if ($request && $request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                    ->orWhere('goal', 'ilike', $search)
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request && $request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Sprint::create($data) !== null;
    }

    /**
     * Display the specified item.
     */
    public function show(int $id): Sprint
    {
        return Sprint::with([
            'project',
            'tasks',
        ])->findOrFail($id);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return Sprint::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Sprint::destroy($id) !== null;
    }

    public function byProject(int $projectId): Collection
    {
        return Sprint::where('project_id', $projectId)
            ->select('id', 'name', 'project_id')
            ->orderBy('name')
            ->get();
    }
}
