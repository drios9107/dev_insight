<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class ProjectService
{
    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, Project>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Project::query()
            ->with(['team', 'owner', 'githubRepository', 'tasks']);
        if ($request && $request->search) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhere('color', 'ilike', $search)
                    ->orWhereHas('team', fn ($sub) => $sub->where('name', 'ilike', $search))
                    ->orWhereHas('owner', fn ($sub) => $sub->where('name', 'ilike', $search))
                    ->orWhereHas('githubRepository', fn ($sub) => $sub->where('name', 'ilike', $search)
                        ->orWhere('full_name', 'ilike', $search));
            });
        }

        if ($request && $request->status && $request->status !== 'all') {
            $query->whereStatus($request->status);
        }

        return $query->latest(null)->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Project
    {
        return Project::create($data);
    }

    /**
     * Display the specified item.
     */
    public function show(int $id): Project
    {
        return Project::with([
            'team.githubUsers',
            'owner',
            'githubRepository',
            'tasks',
        ])
            ->withCount(['tasks', 'sprints'])
            ->findOrFail($id);
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return Project::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Project::destroy($id) > 0;
    }
}
