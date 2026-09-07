<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'link' => $this->link,
            'is_read' => $this->is_read,
            'read_at' => $this->read_at ? date('Y-m-d', strtotime($this->read_at)) : null,
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
