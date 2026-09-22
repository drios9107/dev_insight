<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Task;
use App\Services\CommentService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CommentController extends Controller
{
    private CommentService $service;

    public function __construct(CommentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $data = CommentResource::collection($this->service->index($request));

        return Inertia::render('comment/index', [
            'list' => $data,
            'title' => 'Comments',
        ]);
    }

    public function all()
    {
        return CommentResource::collection($this->service->all());
    }

    public function indexForTask(Task $task)
    {
        $comments = $this->service->indexForTask($task);

        return CommentResource::collection($comments);
    }

    public function storeForTask(Request $request, Task $task)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string|max:5000',
                'parent_id' => 'nullable|exists:comments,id',
                'is_internal' => 'boolean',
            ]);

            $this->service->store($task, $validated);

            return redirect()->back();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'content' => 'Failed to add comment: '.$e->getMessage(),
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string|max:5000',
                'task_id' => 'required|exists:tasks,id',
                'parent_id' => 'nullable|exists:comments,id',
                'is_internal' => 'boolean',
            ]);

            $task = Task::findOrFail($validated['task_id']);
            $this->service->store($task, $validated);

            return redirect()->back();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'content' => 'Failed to add comment: '.$e->getMessage(),
            ]);
        }
    }

    public function show(Comment $comment)
    {
        return new CommentResource($this->service->show($comment->id));
    }

    public function update(Request $request, Comment $comment)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            $this->service->update($comment, $validated);

            return redirect()->back();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'content' => 'Failed to update comment: '.$e->getMessage(),
            ]);
        }
    }

    public function destroy(Comment $comment)
    {
        try {
            $this->service->destroy($comment);

            return redirect()->back();
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'content' => 'Failed to delete comment: '.$e->getMessage(),
            ]);
        }
    }
}
