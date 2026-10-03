<?php

namespace App\Http\Controllers;

use App\Http\Requests\SprintRequest;
use App\Http\Resources\SprintResource;
use App\Models\Sprint;
use App\Services\SprintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class SprintController extends Controller
{
    private SprintService $service;

    public function __construct(SprintService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all(): AnonymousResourceCollection
    {
        return SprintResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $data = SprintResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['status', 'project_id']);

        return Inertia::render('sprint/index', [
            'list' => $data,
            'title' => 'Sprints',
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SprintRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('sprint.index')
            ->with('success', 'Sprint created successfully!');
    }

    public function show(Sprint $sprint): SprintResource
    {
        return new SprintResource($this->service->show($sprint->id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SprintRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('sprint.index')
            ->with('success', 'Sprint updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Sprint deleted successfully!');
    }

    public function byProject(int $projectId): JsonResponse
    {
        $sprints = $this->service->byProject($projectId);

        return response()->json(['data' => $sprints]);
    }
}
