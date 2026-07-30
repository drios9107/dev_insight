<?php

namespace App\Http\Controllers;

use App\Http\Requests\PullRequestReviewRequest;
use App\Http\Resources\PullRequestReviewResource;
use App\Services\PullRequestReviewService;

class PullRequestReviewController extends Controller
{
    private PullRequestReviewService $pullRequest;

    public function __construct(PullRequestReviewService $pullRequest)
    {
        $this->pullRequest = $pullRequest;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PullRequestReviewResource::collection($this->pullRequest->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PullRequestReviewRequest $request)
    {
        return new PullRequestReviewResource($this->pullRequest->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new PullRequestReviewResource($this->pullRequest->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PullRequestReviewRequest $request, int $id)
    {
        return new PullRequestReviewResource($this->pullRequest->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->pullRequest->destroy($id);

        return response()->noContent();
    }
}
