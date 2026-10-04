<?php

namespace App\Http\Resources;

use App\Models\GithubRepository;
use App\Models\GithubUser;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $github_id
 * @property-read int $number
 * @property-read string $title
 * @property-read string|null $body
 * @property-read string $state
 * @property-read string $base_branch
 * @property-read string $head_branch
 * @property-read string|null $merge_commit_sha
 * @property-read Carbon|null $closed_at
 * @property-read Carbon|null $merged_at
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read GithubRepository|null $githubRepository
 * @property-read GithubUser|null $author
 * @property-read Collection<int, GithubUser>|null $assignees
 * @property-read Task|null $task
 */
class PullRequestResource extends JsonResource
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
            'number' => $this->number,
            'title' => $this->title,
            'body' => $this->body,
            'state' => $this->state,
            'github_repository' => $this->whenLoaded('githubRepository', fn () => [
                'id' => $this->githubRepository->id,
                'name' => $this->githubRepository->name,
                'full_name' => $this->githubRepository->full_name,
            ]),
            'author' => $this->author,
            'assignees' => $this->whenLoaded(
                'assignees',
                fn () => $this->assignees->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->displayName,
                ])
            ),
            'task' => $this->whenLoaded('task', fn () => [
                'id' => $this->task->id,
                'title' => $this->task->title,
            ]),
            'base_branch' => $this->base_branch,
            'head_branch' => $this->head_branch,
            'merge_commit_sha' => $this->merge_commit_sha,
            'closed_at' => $this->closed_at ? date('Y-m-d', strtotime($this->closed_at)) : null,
            'merged_at' => $this->merged_at ? date('Y-m-d', strtotime($this->merged_at)) : null,
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
