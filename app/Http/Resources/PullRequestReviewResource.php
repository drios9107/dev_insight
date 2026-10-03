<?php

namespace App\Http\Resources;

use App\Models\GithubUser;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $github_id
 * @property-read string $state
 * @property-read string|null $body
 * @property-read Carbon|null $submitted_at
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read PullRequest|null $pullRequest
 * @property-read GithubUser|null $reviewer
 */
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
            'pull_request' => $this->whenLoaded('pullRequest', fn() => [
                'id' => $this->pullRequest->id,
                'title' => $this->pullRequest->title,
            ]),
            'reviewer' => $this->whenLoaded('reviewer', fn() => [
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
