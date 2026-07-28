<?php

namespace App\Http\Controllers;

use App\Http\Requests\GithubRepositoryRequest;
use App\Http\Resources\GithubRepositoryResource;
use App\Services\GithubRepositoryService;

class GithubRepositoryController extends Controller
{
    private GithubRepositoryService $githubRepositoryService;

    public function __construct(GithubRepositoryService $githubRepositoryService)
    {
        $this->githubRepositoryService = $githubRepositoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return GithubRepositoryResource::collection($this->githubRepositoryService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GithubRepositoryRequest $request)
    {
        return new GithubRepositoryResource($this->githubRepositoryService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new GithubRepositoryResource($this->githubRepositoryService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GithubRepositoryRequest $request, int $id)
    {
        return new GithubRepositoryResource($this->githubRepositoryService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->githubRepositoryService->destroy($id);

        return response()->noContent();
    }
}
