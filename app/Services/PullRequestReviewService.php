<?php

namespace App\Services;

use App\Models\PullRequestReview;

class PullRequestReviewService
{
    public function index()
    {
        return PullRequestReview::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return PullRequestReview::create($data) !== null;
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return PullRequestReview
     */
    public function show($id)
    {
        $item = PullRequestReview::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     */
    public function update(int $id, array $data): bool
    {
        return PullRequestReview::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return PullRequestReview::destroy($id) !== null;
    }
}
