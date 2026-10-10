<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkDestroyRequest;
use App\Http\Requests\PullRequestReviewRequest;
use App\Http\Resources\PullRequestReviewResource;
use App\Models\GithubUser;
use App\Models\User;
use App\Services\PullRequestReviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class PullRequestReviewController extends Controller
{
    private PullRequestReviewService $service;

    public function __construct(PullRequestReviewService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all(): AnonymousResourceCollection
    {
        return PullRequestReviewResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $data = PullRequestReviewResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['state', 'reviewer_id']);

        $reviewers = GithubUser::select('id', 'name')->get();

        return Inertia::render('pull-request-review/index', [
            'list' => $data,
            'title' => 'PR Reviews',
            'filters' => $filters,
            'reviewers' => $reviewers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PullRequestReviewRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('pull-request-review.index')
            ->with('success', 'PR Review created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PullRequestReviewRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('pull-request-review.index')
            ->with('success', 'PR Review updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'PR Review deleted successfully!');
    }

    public function bulkDestroy(BulkDestroyRequest $request): RedirectResponse
    {
        $this->service->bulkDestroy($request->validated()['ids']);

        return redirect()->back()
            ->with('success', 'Deleted successfully!');
    }
}
