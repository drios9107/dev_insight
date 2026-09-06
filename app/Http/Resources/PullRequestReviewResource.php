<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PullRequestReviewResource extends JsonResource
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
            'github_id' => $this->github_id,
            'pull_request' => $this->whenLoaded('pullRequest', fn () => [
                'id' => $this->pullRequest->id,
                'title' => $this->pullRequest->title,
            ]),
            'reviewer' => $this->whenLoaded('reviewer', fn () => [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
            ]),
            'state' => $this->state,
            'body' => $this->body,
            'submitted_at' => $this->submitted_at ? date('Y-m-d', strtotime($this->submitted_at)) : null,
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
