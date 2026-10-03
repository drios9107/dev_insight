<?php

namespace App\Services;

use App\Models\Comment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentService
{
    /**
     * Paginated listing (for the general comments page)
     * 
     * @return LengthAwarePaginator<int, Comment>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Comment::query()->with(['user', 'task', 'parent']);

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('content', 'ilike', $search)
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('task', function ($t) use ($search) {
                        $t->where('title', 'ilike', $search);
                    });
            });
        }

        if ($request->filled('task_id') && $request->task_id !== 'all') {
            $query->where('task_id', $request->task_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Comments for a specific task (root comments + replies)
     * @return Collection<int, Comment>
     */
    public function indexForTask(Task $task): Collection
    {
        return Comment::where('task_id', $task->id)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();
    }

    /**
     * Create a comment in a task
     * @param  array<string, mixed>  $data
     * @return Comment
     */
    public function store(Task $task, array $data): Comment
    {
        return Comment::create([
            'content' => $data['content'],
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'parent_id' => $data['parent_id'] ?? null,
            'is_internal' => $data['is_internal'] ?? false,
        ]);
    }

    /**
     * Show a single comment
     */
    public function show(int $id): Comment
    {
        return Comment::with(['user', 'task', 'parent', 'replies.user'])->findOrFail($id);
    }

    /**
     * @param  Comment  $comment
     * @param  array<string, mixed>  $data
     * @return Comment
     */
    public function update(Comment $comment, array $data): Comment
    {
        $comment->update([
            'content' => $data['content'],
        ]);

        return $comment;
    }

    /**
     * Delete a comment
     */
    public function destroy(Comment $comment): bool
    {
        return $comment->delete();
    }
}
