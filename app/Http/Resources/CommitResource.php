<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommitResource extends JsonResource
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
            'sha' => $this->sha,
            'github_repository' => $this->github_repository,
            'author' => $this->author,
            'task' => $this->task,
            'message' => $this->message,
            'date' => $this->date ? date('Y-m-d', strtotime($this->date)) : null,
            'url' => $this->url,
            'additions' => $this->additions,
            'deletions' => $this->deletions,
            'total_changes' => $this->total_changes,
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
