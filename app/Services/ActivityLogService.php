<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogService
{
    public function index(?Request $request = null)
    {
        $query = ActivityLog::query()->with(['user', 'team', 'project', 'task']);

        if ($request && $request->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('type', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search)
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'ilike', $search);
                    });
            });
        }

        if ($request && $request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request && $request->filled('user_id') && $request->user_id !== 'all') {
            $query->where('user_id', $request->user_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return ActivityLog::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return ActivityLog
     */
    public function show($id)
    {
        $item = ActivityLog::findOrFail($id);

        return $item;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return ActivityLog::destroy($id) !== null;
    }
}
