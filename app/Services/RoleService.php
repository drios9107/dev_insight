<?php

namespace App\Services;

use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class RoleService
{
    /**
     * Returns a paginated list
     * @return LengthAwarePaginator<int, Role>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Role::query()->withCount('users');

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search);
            });
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     * @param  array<string, mixed>  $data
     * @return Role
     */
    public function store(array $data): Role
    {
        return Role::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Role
     */
    public function show($id)
    {
        $item = Role::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     * @param int $id
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return Role::whereId($id)->update($data) > 0;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Role::destroy($id) > 0;
    }
}
