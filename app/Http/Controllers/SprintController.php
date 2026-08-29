<?php

namespace App\Http\Controllers;

use App\Http\Requests\SprintRequest;
use App\Http\Resources\SprintResource;
use App\Services\SprintService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
    public function all()
    {
        return SprintResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = SprintResource::collection($this->service->index($request));

        return Inertia::render('sprint/index', [
            'list' => $data,
            'title' => 'Sprints',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SprintRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('sprint.index')
            ->with('success', 'Sprint created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SprintRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('sprint.index')
            ->with('success', 'Sprint updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Sprint deleted successfully!');
    }
}
