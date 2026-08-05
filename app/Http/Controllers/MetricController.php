<?php

namespace App\Http\Controllers;

use App\Http\Requests\MetricRequest;
use App\Http\Resources\MetricResource;
use App\Services\MetricService;
use Inertia\Inertia;

class MetricController extends Controller
{
    private MetricService $service;

    public function __construct(MetricService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return MetricResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = MetricResource::collection($this->service->index());

        return Inertia::render('team/index', [
            'list' => $data,
            'title' => 'Metrics',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MetricRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('team.index')
            ->with('success', 'Metric created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MetricRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('team.index')
            ->with('success', 'Metric updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Metric deleted successfully!');
    }
}
