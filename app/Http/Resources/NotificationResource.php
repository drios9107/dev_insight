<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read string $type
 * @property-read string $title
 * @property-read string $message
 * @property-read string|null $link
 * @property-read bool $is_read
 * @property-read Carbon|null $read_at
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read User|null $user
 */
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
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
