<?php

namespace App\Services;

use App\Models\GithubRepository;

class GithubRepositoryService
{
    public function index()
    {
        return GithubRepository::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return GithubRepository::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return GithubRepository
     */
    public function show($id)
    {
        $item = GithubRepository::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return GithubRepository::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return GithubRepository::destroy($id) !== null;
    }
}
