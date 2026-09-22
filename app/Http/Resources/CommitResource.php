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
            'github_repository' => $this->whenLoaded('githubRepository', fn () => [
                'id' => $this->githubRepository->id,
                'name' => $this->githubRepository->name,
                'full_name' => $this->githubRepository->full_name,
            ]),
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $this->author->id,
                'name' => $this->author->displayName,
                'username' => $this->author->username,
                'avatar' => $this->author->avatar,
            ]),
            'pull_request' => $this->whenLoaded('pullRequest', fn () => [
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
