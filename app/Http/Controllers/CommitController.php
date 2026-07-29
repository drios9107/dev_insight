<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitRequest;
use App\Http\Resources\CommitResource;
use App\Services\CommitService;

class CommitController extends Controller
{
    private CommitService $githubIssueService;

    public function __construct(CommitService $githubIssueService)
    {
        $this->githubIssueService = $githubIssueService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CommitResource::collection($this->githubIssueService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CommitRequest $request)
    {
        return new CommitResource($this->githubIssueService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new CommitResource($this->githubIssueService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CommitRequest $request, int $id)
    {
        return new CommitResource($this->githubIssueService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->githubIssueService->destroy($id);

        return response()->noContent();
    }
}
