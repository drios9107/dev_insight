<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function PHPUnit\Framework\isNull;

class SprintResource extends JsonResource
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
            'name' => $this->name,
            'goal' => $this->goal,
            'project' => $this->project,
            'status' => $this->status,
            'velocity' => $this->velocity,
            'actual_velocity' => $this->actual_vlocity,
            'start_date' => ! isNull($this->start_date) ? date_format($this->start_date, 'Y-m-d') : '',
            'end_date' => ! isNull($this->end_date) ? date_format($this->end_date, 'Y-m-d') : '',
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
