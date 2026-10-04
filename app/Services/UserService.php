<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class UserService
{
    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = User::query()->with('role');

        if ($request->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', $search)
                    ->orWhere('email', 'ilike', $search)
                    ->orWhereHas('role', function ($r) use ($search) {
                        $r->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request->filled('role_id') && $request->role_id !== 'all') {
            $query->where('role_id', $request->role_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): User
    {
        return User::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return User
     */
    public function show($id)
    {
        $item = User::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return User::whereId($id)->update($data) > 0;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return User::destroy($id) > 0;
    }
}
