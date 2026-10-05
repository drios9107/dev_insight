<?php

namespace App\Services;

use App\Models\Sprint;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SprintService
{
    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, Sprint>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Sprint::query()
            ->with(['project']);

        if ($request?->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                    ->orWhere('goal', 'ilike', $search)
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request?->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Sprint
    {

        $data['created_by'] = Auth::id();

        return Sprint::create($data);
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
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return Sprint::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Sprint::destroy($id) > 0;
    }

    /**
     * @return Collection<int, Sprint>
     */
    public function byProject(int $projectId): Collection
    {
        return Sprint::where('project_id', $projectId)
            ->select('id', 'name', 'project_id')
            ->orderBy('name')
            ->get();
    }
}
