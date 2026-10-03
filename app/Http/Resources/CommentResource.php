<?php

namespace App\Http\Resources;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read string $content
 * @property-read bool $is_internal
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read User|null $user
 * @property-read Task|null $task
 * @property-read Comment|null $parent
 * @property-read Collection<int, Comment>|null $replies
 */
class CommentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'is_internal' => $this->is_internal,
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar_url,
            ]),
            'task' => $this->whenLoaded('task', fn() => [
                'id' => $this->task->id,
                'title' => $this->task->title,
            ]),
            'parent' => $this->whenLoaded('parent', fn() => [
                'id' => $this->parent->id,
                'content' => $this->parent->content,
            ]),
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at?->diffForHumans(),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
