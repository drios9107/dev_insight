<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read int|null $user_id
 * @property-read string $type
 * @property-read string $description
 * @property-read array<string, mixed>|null $changes
 * @property-read string|null $ip_address
 * @property-read string|null $user_agent
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read User|null $user
 */
class ActivityLogResource extends JsonResource
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
            'type' => $this->type,
            'description' => $this->description,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ]),
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'changes' => $this->changes,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
