<?php

namespace App\Http\Controllers;

use App\Http\Requests\NotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;

class NotificationController extends Controller
{
    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return NotificationResource::collection($this->notificationService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NotificationRequest $request)
    {
        return new NotificationResource($this->notificationService->store($request->validated()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(NotificationRequest $request, int $id)
    {
        return new NotificationResource($this->notificationService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->notificationService->destroy($id);

        return response()->json(null, 204);
    }
}
