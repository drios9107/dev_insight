<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkDestroyRequest;
use App\Http\Requests\TeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use App\Services\TeamService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    private TeamService $service;

    public function __construct(TeamService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all(): AnonymousResourceCollection
    {
        return TeamResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $data = TeamResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['is_active']);

        return Inertia::render('team/index', [
            'list' => $data,
            'title' => 'Teams',
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TeamRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());

        return redirect()->route('team.index')
            ->with('success', 'Team created successfully!');
    }

    public function show(Team $team): TeamResource
    {
        return new TeamResource($this->service->show($team->id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TeamRequest $request, int $id): RedirectResponse
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('team.index')
            ->with('success', 'Team updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Team deleted successfully!');
    }

    public function bulkDestroy(BulkDestroyRequest $request): RedirectResponse
    {
        $this->service->bulkDestroy($request->validated()['ids']);

        return redirect()->back()
            ->with('success', 'Deleted successfully!');
    }
}
