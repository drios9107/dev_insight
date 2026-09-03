<?php

namespace App\Http\Controllers;

use App\Http\Requests\GithubRepositoryRequest;
use App\Http\Resources\GithubRepositoryResource;
use App\Services\GithubRepositoryService;
use Inertia\Inertia;

class GithubRepositoryController extends Controller
{
    private GithubRepositoryService $service;

    public function __construct(GithubRepositoryService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return GithubRepositoryResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = GithubRepositoryResource::collection($this->service->index());

        return Inertia::render('github-repository/index', [
            'list' => $data,
            'title' => 'Github Repositories',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GithubRepositoryRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('github-repository.index')
            ->with('success', 'Github Repository created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GithubRepositoryRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('github-repository.index')
            ->with('success', 'Github Repository updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Github Repository deleted successfully!');
    }
}
