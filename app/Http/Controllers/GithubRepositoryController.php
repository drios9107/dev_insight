<?php

namespace App\Http\Controllers;

use App\Http\Requests\GithubRepositoryRequest;
use App\Http\Resources\GithubRepositoryResource;
use App\Services\GithubRepositoryService;
use App\Services\GithubService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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
    public function index(Request $request)
    {
        $data = GithubRepositoryResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['is_private']);

        return Inertia::render('github-repository/index', [
            'list' => $data,
            'title' => 'GitHub Repositories',
            'filters' => $filters,
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

    public function syncAll(GithubService $githubService, Request $request)
    {
        try {
            $username = $request->input('ownerKey');

            if (! $username) {
                throw new \Exception('No github username was provided');
            }

            $results = $this->service->syncAllFromGithub($githubService, $username);

            return back()->with('success', sprintf(
                'Synced: %d created, %d updated',
                $results['created'],
                $results['updated']
            ));
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'ownerKey' => $e->getMessage(),
            ]);
        }
    }
}
