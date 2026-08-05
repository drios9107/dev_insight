<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeamRequest;
use App\Http\Resources\TeamResource;
use App\Services\TeamService;
use Inertia\Inertia;

class TeamController extends Controller
{
    private TeamService $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = TeamResource::collection($this->teamService->index());

        return Inertia::render('team/index', [
            'list' => $data,
            'title' => 'Teams',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TeamRequest $request)
    {
        $validated = $request->validated();

        $this->teamService->store($validated);

        return redirect()->route('team.index')
            ->with('success', 'Team created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TeamRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->teamService->update($id, $validated);

        return redirect()->route('team.index')
            ->with('success', 'Team updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->teamService->destroy($id);

        return response()->json(null, 204);
    }
}
