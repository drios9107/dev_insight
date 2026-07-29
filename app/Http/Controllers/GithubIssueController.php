<?php

namespace App\Http\Controllers;

use App\Http\Requests\GithubIssueRequest;
use App\Http\Resources\GithubIssueResource;
use App\Services\GithubIssueService;

class GithubIssueController extends Controller
{
    private GithubIssueService $githubIssueService;

    public function __construct(GithubIssueService $githubIssueService)
    {
        $this->githubIssueService = $githubIssueService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return GithubIssueResource::collection($this->githubIssueService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GithubIssueRequest $request)
    {
        return new GithubIssueResource($this->githubIssueService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new GithubIssueResource($this->githubIssueService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GithubIssueRequest $request, int $id)
    {
        return new GithubIssueResource($this->githubIssueService->update($id, $request->validated()));
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
