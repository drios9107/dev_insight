<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
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
