<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeamRequest;
use App\Http\Resources\TeamResource;
use App\Services\TeamService;

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
        return TeamResource::collection($this->teamService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TeamRequest $request)
    {
        return new TeamResource($this->teamService->store($request->validated()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TeamRequest $request, int $id)
    {
        return new TeamResource($this->teamService->update($id, $request->validated()));
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
