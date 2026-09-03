<?php

namespace App\Http\Controllers;

use App\Http\Requests\GithubIssueRequest;
use App\Http\Resources\GithubIssueResource;
use App\Models\GithubRepository;
use App\Services\GithubIssueService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GithubIssueController extends Controller
{
    private GithubIssueService $service;

    public function __construct(GithubIssueService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return GithubIssueResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = GithubIssueResource::collection($this->service->index($request));

        $filters = [];
        if ($request->has('state')) {
            $filters['state'] = $request->state;
        }
        if ($request->has('repository_id')) {
            $filters['repository_id'] = $request->repository_id;
        }

        $repositories = GithubRepository::select('id', 'full_name')->get();

        return Inertia::render('github-issue/index', [
            'list' => $data,
            'title' => 'GitHub Issues',
            'filters' => $filters,
            'repositories' => $repositories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GithubIssueRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('github-issue.index')
            ->with('success', 'Github Issue created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GithubIssueRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('github-issue.index')
            ->with('success', 'Github Issue updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Github Issue deleted successfully!');
    }
}
