<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationService
{
    public function index(?Request $request = null)
    {
        $query = Notification::query();

        if ($request && $request->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                    ->orWhere('message', 'ilike', $search)
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request && $request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request && $request->has('is_read') && $request->is_read !== 'all') {
            $query->where('is_read', $request->is_read === '1');
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Notification::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return Notification::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Notification::destroy($id) !== null;
    }
}
