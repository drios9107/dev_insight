<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function PHPUnit\Framework\isNull;

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
            'reviewer' => $this->reviewer,
            'pull_request' => $this->pull_request,
            'state' => $this->state,
            'body' => $this->body,
            'submitted_at' => (bool) $this->submitted_at ? date_format($this->submitted_at, 'Y-m-d') : '',
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
