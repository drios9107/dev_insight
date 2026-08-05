<?php

namespace App\Http\Controllers;

use App\Http\Requests\PullRequestRequest;
use App\Http\Resources\PullRequestResource;
use App\Services\PullRequestService;
use Inertia\Inertia;

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
    public function all()
    {
        return PullRequestResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = PullRequestResource::collection($this->service->index());

        return Inertia::render('team/index', [
            'list' => $data,
            'title' => 'PRs',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PullRequestRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('team.index')
            ->with('success', 'PR created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PullRequestRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('team.index')
            ->with('success', 'PR updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'PR deleted successfully!');
    }
}
