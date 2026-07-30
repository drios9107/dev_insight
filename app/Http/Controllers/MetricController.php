<?php

namespace App\Http\Controllers;

use App\Http\Requests\MetricRequest;
use App\Http\Resources\MetricResource;
use App\Services\MetricService;

class MetricController extends Controller
{
    private MetricService $metricService;

    public function __construct(MetricService $metricService)
    {
        $this->metricService = $metricService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MetricResource::collection($this->metricService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MetricRequest $request)
    {
        return new MetricResource($this->metricService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new MetricResource($this->metricService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MetricRequest $request, int $id)
    {
        return new MetricResource($this->metricService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->metricService->destroy($id);

        return response()->noContent();
    }
}
