<?php

namespace App\Http\Controllers;

use App\Http\Requests\PullRequestRequest;
use App\Http\Resources\PullRequestResource;
use App\Services\PullRequestService;

class PullRequestController extends Controller
{
    private PullRequestService $pullRequest;

    public function __construct(PullRequestService $pullRequest)
    {
        $this->pullRequest = $pullRequest;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PullRequestResource::collection($this->pullRequest->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PullRequestRequest $request)
    {
        return new PullRequestResource($this->pullRequest->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new PullRequestResource($this->pullRequest->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PullRequestRequest $request, int $id)
    {
        return new PullRequestResource($this->pullRequest->update($id, $request->validated()));
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
