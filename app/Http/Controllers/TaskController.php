<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use Inertia\Inertia;

class TaskController extends Controller
{
    private TaskService $service;

    public function __construct(TaskService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return TaskResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = TaskResource::collection($this->service->index());

        return Inertia::render('team/index', [
            'list' => $data,
            'title' => 'Tasks',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('team.index')
            ->with('success', 'Task created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('team.index')
            ->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Task deleted successfully!');
    }
}
