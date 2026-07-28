<?php

namespace App\Services;

use App\Models\Role;

class RoleService
{
    public function index()
    {
        return Role::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Role::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return Role::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Role::destroy($id) !== null;
    }
}
