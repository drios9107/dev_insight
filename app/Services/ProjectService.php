<?php

namespace App\Services;

use App\Models\Project;

class ProjectService
{
    public function index()
    {
        return Project::all();
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
