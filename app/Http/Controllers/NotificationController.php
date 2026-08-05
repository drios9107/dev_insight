<?php

namespace App\Http\Controllers;

use App\Http\Requests\NotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Inertia\Inertia;

class NotificationController extends Controller
{
    private NotificationService $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return NotificationResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = NotificationResource::collection($this->service->index());

        return Inertia::render('notification/index', [
            'list' => $data,
            'title' => 'Notifications',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NotificationRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('notification.index')
            ->with('success', 'Notification created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(NotificationRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('notification.index')
            ->with('success', 'Notification updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Notification deleted successfully!');
    }
}
