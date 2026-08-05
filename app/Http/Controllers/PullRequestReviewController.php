<?php

namespace App\Http\Controllers;

use App\Http\Requests\PullRequestReviewRequest;
use App\Http\Resources\PullRequestReviewResource;
use App\Services\PullRequestReviewService;
use Inertia\Inertia;

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
    public function all()
    {
        return PullRequestReviewResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = PullRequestReviewResource::collection($this->service->index());

        return Inertia::render('pull-request-review/index', [
            'list' => $data,
            'title' => 'PR Reviews',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PullRequestReviewRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('pull-request-review.index')
            ->with('success', 'PR Review created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PullRequestReviewRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('pull-request-review.index')
            ->with('success', 'PR Review updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'PR Review deleted successfully!');
    }
}
