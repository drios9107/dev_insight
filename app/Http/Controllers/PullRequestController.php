<?php

namespace App\Http\Controllers;

use App\Http\Requests\PullRequestRequest;
use App\Http\Resources\PullRequestResource;
use App\Models\GithubRepository;
use App\Services\PullRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class PullRequestController extends Controller
{
    private PullRequestService $service;

    public function __construct(PullRequestService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all(): AnonymousResourceCollection
    {
        return PullRequestResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $data = PullRequestResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['state', 'repository_id', 'stale']);

        $repositories = GithubRepository::select('id', 'name', 'full_name')->get();

        return Inertia::render('pull-request/index', [
            'list' => $data,
            'title' => 'Pull Requests',
            'filters' => $filters,
            'repositories' => $repositories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PullRequestRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('pull-request.index')
            ->with('success', 'PR created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PullRequestRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('pull-request.index')
            ->with('success', 'PR updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'PR deleted successfully!');
    }
}
