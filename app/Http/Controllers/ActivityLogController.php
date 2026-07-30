<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityLogRequest;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;

class ActivityLogController extends Controller
{
    private ActivityLogService $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ActivityLogResource::collection($this->activityLogService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ActivityLogRequest $request)
    {
        return new ActivityLogResource($this->activityLogService->store($request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->activityLogService->destroy($id);

        return response()->json(null, 204);
    }
}
