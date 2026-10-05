<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class NotificationService
{
    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, Notification>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Notification::query()
            ->with('user');

        if ($request?->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                    ->orWhere('message', 'ilike', $search)
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request?->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request && $request->has('is_read') && $request->is_read !== 'all') {
            $query->where('is_read', $request->is_read === '1');
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Notification
    {
        return Notification::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Notification
     */
    public function show($id)
    {
        $item = Notification::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return Notification::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Notification::destroy($id) > 0;
    }
}
