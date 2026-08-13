<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function PHPUnit\Framework\isNull;

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
            'github' => $this->github,
            'github_repository' => $this->github_repository,
            'author' => $this->author,
            'number' => $this->number,
            'title' => $this->title,
            'body' => $this->body,
            'state' => $this->state,
            'closed_at' => ! isNull($this->closed_at) ? date_format($this->closed_at, 'Y-m-d') : '',
            'created_at' => date_format($this->created_at, 'Y-m-d'),
            'updated_at' => date_format($this->updated_at, 'Y-m-d'),
        ];
    }
}
