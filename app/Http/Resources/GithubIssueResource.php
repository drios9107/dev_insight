<?php

namespace App\Http\Resources;

use App\Models\GithubRepository;
use App\Models\GithubUser;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read int $github_id
 * @property-read int $number
 * @property-read string $title
 * @property-read string|null $body
 * @property-read string $state
 * @property-read Carbon|null $closed_at
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read GithubRepository|null $githubRepository
 * @property-read GithubUser|null $author
 * @property-read Task|null $task
 */
class GithubIssueResource extends JsonResource
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
            'github_repository' => $this->githubRepository,
            'author' => $this->whenLoaded('author', fn() => [
                'id' => $this->author->id,
                'name' => $this->author->displayName,
            ]),
            'task' => $this->task,
            'number' => $this->number,
            'title' => $this->title,
            'body' => $this->body,
            'state' => $this->state,
            'closed_at' => $this->closed_at ? date('Y-m-d', strtotime($this->closed_at)) : null,
            'created_at' => $this->created_at ? date('Y-m-d', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('Y-m-d', strtotime($this->updated_at)) : null,
        ];
    }
}
