<?php

namespace App\Http\Controllers;

use App\Http\Requests\SprintRequest;
use App\Http\Resources\SprintResource;
use App\Services\SprintService;

class SprintController extends Controller
{
    private SprintService $sprintService;

    public function __construct(SprintService $sprintService)
    {
        $this->sprintService = $sprintService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SprintResource::collection($this->sprintService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SprintRequest $request)
    {
        return new SprintResource($this->sprintService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new SprintResource($this->sprintService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SprintRequest $request, int $id)
    {
        return new SprintResource($this->sprintService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->sprintService->destroy($id);

        return response()->noContent();
    }
}
