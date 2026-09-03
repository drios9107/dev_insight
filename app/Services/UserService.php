<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function index()
    {
        return User::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return User::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return User::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return User::destroy($id) !== null;
    }
}
