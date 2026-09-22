<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitRequest;
use App\Http\Resources\CommitResource;
use App\Models\GithubRepository;
use App\Models\PullRequest;
use App\Services\CommitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommitController extends Controller
{
    private CommitService $service;

    public function __construct(CommitService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return CommitResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = CommitResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['repository_id', 'pull_request_id']);

        $repositories = GithubRepository::select('id', 'name', 'full_name')->get();
        $pullRequests = PullRequest::where('state', 'merged')
            ->select('id', 'number', 'title')
            ->orderByDesc('number')
            ->get();

        return Inertia::render('commit/index', [
            'list' => $data,
            'title' => 'Commits',
            'filters' => $filters,
            'repositories' => $repositories,
            'pull_requests' => $pullRequests,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CommitRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('commit.index')
            ->with('success', 'Commit created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CommitRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('commit.index')
            ->with('success', 'Commit updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Commit deleted successfully!');
    }
}
