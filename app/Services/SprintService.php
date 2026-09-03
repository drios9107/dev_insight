<?php

namespace App\Services;

use App\Models\Sprint;

class SprintService
{
    public function index()
    {
        return Sprint::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Sprint::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Sprint
     */
    public function show($id)
    {
        $item = Sprint::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return Sprint::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Sprint::destroy($id) !== null;
    }
}
