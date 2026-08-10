<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'content' => $this->content,
            'user' => $this->user?->name ?? '',
            'task' => $this->task?->name ?? '',
            'parent' => $this->parent ?? '',
            'is_internal' => $this->is_internal,
        ];
    }
}
