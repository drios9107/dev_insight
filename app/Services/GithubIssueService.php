<?php

namespace App\Services;

use App\Models\GithubIssue;

class GithubIssueService
{
    public function index()
    {
        return GithubIssue::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return GithubIssue::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return GithubIssue
     */
    public function show($id)
    {
        $item = GithubIssue::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return GithubIssue::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return GithubIssue::destroy($id) !== null;
    }
}
