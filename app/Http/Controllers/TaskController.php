<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;

class TaskController extends Controller
{
    private TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TaskResource::collection($this->taskService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        return new TaskResource($this->taskService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new TaskResource($this->taskService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, int $id)
    {
        return new TaskResource($this->taskService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        return new TaskResource($this->taskService->destroy($id));
    }
}
