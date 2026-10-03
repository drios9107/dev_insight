<?php

namespace App\Http\Resources;

use App\Models\Commit;
use App\Models\GithubRepository;
use App\Models\GithubUser;
use App\Models\PullRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property-read int $id
 * @property-read string $sha
 * @property-read string $message
 * @property-read Carbon|null $date
 * @property-read string|null $url
 * @property-read Carbon|null $created_at
 * @property-read Carbon|null $updated_at
 * @property-read GithubRepository|null $githubRepository
 * @property-read GithubUser|null $author
 * @property-read PullRequest|null $pullRequest
 */
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
            'github_repository' => $this->whenLoaded('githubRepository', fn() => [
                'id' => $this->githubRepository->id,
                'name' => $this->githubRepository->name,
                'full_name' => $this->githubRepository->full_name,
            ]),
            'author' => $this->whenLoaded('author', fn() => [
                'id' => $this->author->id,
                'name' => $this->author->displayName,
                'username' => $this->author->username,
                'avatar' => $this->author->avatar,
            ]),
            'pull_request' => $this->whenLoaded('pullRequest', fn() => [
                'id' => $this->pullRequest->id,
                'number' => $this->pullRequest->number,
                'title' => $this->pullRequest->title,
            ]),
            'message' => $this->message,
            'date' => $this->date ? date('Y-m-d', strtotime($this->date)) : null,
            'url' => $this->url,
            'created_at' => $this->created_at?->format('Y-m-d'),
            'updated_at' => $this->updated_at?->format('Y-m-d'),
        ];
    }
}
