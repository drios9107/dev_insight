<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamService
{
    public function index(?Request $request = null)
    {
        $query = Team::query()->with(['owner', 'githubUsers']);

        if ($request && $request->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhereHas('owner', function ($o) use ($search) {
                        $o->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request && $request->has('is_active') && $request->is_active !== 'all') {
            $query->where('is_active', $request->is_active === '1');
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): Team
    {
        $githubUserIds = $data['github_user_ids'] ?? [];
        unset($data['github_user_ids']);

        $team = Team::create($data);

        if (! empty($githubUserIds)) {
            $team->githubUsers()->sync($githubUserIds);
        }

        return $team;
    }

    /**
     * Display the specified item.
     */
    public function show(int $id): Team
    {
        return Team::with([
            'owner',
            'githubUsers',
        ])->findOrFail($id);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): Team
    {
        $team = Team::findOrFail($id);

        $githubUserIds = $data['github_user_ids'] ?? [];
        unset($data['github_user_ids']);

        $team->update($data);

        $team->githubUsers()->sync($githubUserIds);

        return $team;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Team::destroy($id) !== null;
    }
}
