<?php

namespace App\Http\Controllers;

use App\Concerns\ExtractsFilters;
use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\GithubUser;
use App\Models\Project;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    use ExtractsFilters;

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
    public function index(Request $request)
    {
        $data = TaskResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['status', 'priority', 'overdue', 'project_id', 'assignee_id']);

        $projects = Project::select('id', 'name')->get();
        $githubUsers = GithubUser::select('id', 'username', 'name')->get();

        return Inertia::render('task/index', [
            'list' => $data,
            'title' => 'Tasks',
            'filters' => $filters,
            'projects' => $projects,
            'github_users' => $githubUsers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('task.index')
            ->with('success', 'Task created successfully!');
    }

    public function show(Task $task)
    {
        return new TaskResource($this->service->show($task->id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('task.index')
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
