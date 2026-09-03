<?php

namespace App\Services;

use App\Models\ActivityLog;

class ActivityLogService
{
    public function index()
    {
        return ActivityLog::all();
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
