<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityLogRequest;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    private ActivityLogService $service;

    public function __construct(ActivityLogService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return ActivityLogResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = ActivityLogResource::collection($this->service->index());

        return Inertia::render('team/index', [
            'list' => $data,
            'title' => 'Activity Logs',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ActivityLogRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('team.index')
            ->with('success', 'Activity Log created successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Activity Log deleted successfully!');
    }
}
