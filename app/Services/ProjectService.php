<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectService
{
    public function index(?Request $request = null)
    {
        $query = Project::query();
        if ($request->search) {
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

        if ($request->status && $request->status !== 'all') {
            $query->whereStatus($request->status);
        }

        return $query->latest(null)->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Project::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Project
     */
    public function show($id)
    {
        $item = Project::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return Project::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Project::destroy($id) !== null;
    }
}
