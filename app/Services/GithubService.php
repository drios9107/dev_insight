<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GithubService
{
    private string $apiBase;

    private string $token;

    public function __construct()
    {
        $this->apiBase = config('services.github.api_url', 'https://api.github.com');
        $this->token = config('services.github.token', '');
    }

    /**
     * @param  array<string, mixed>  $params
     * @return array<int|string, mixed>
     *
     * @throws Exception
     */
    private function get(string $endpoint, array $params = []): array
    {
        $url = $this->apiBase.$endpoint;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->token,
            'Accept' => 'application/vnd.github.v3+json',
        ])->get($url, $params);

        if ($response->failed()) {
            Log::error('***GitHub API error', [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new Exception('GitHub API error: '.$response->status());
        }

        return $response->json();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getUser(string $username): ?array
    {
        try {
            return $this->get("/users/{$username}");
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getCommits(string $owner, string $repo, int $perPage = 100): array
    {
        /** @var array<int, array<string, mixed>> $response */
        $response = $this->get("/repos/{$owner}/{$repo}/commits", [
            'per_page' => $perPage,
        ]);

        return $response;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getPullRequests(string $owner, string $repo, string $state = 'all', int $perPage = 100): array
    {
        /** @var array<int, array<string, mixed>> $response */
        $response = $this->get("/repos/{$owner}/{$repo}/pulls", [
            'state' => $state,
            'per_page' => $perPage,
        ]);

        return $response;
    }

    /**
     * Obtener issues de un repositorio.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getIssues(string $owner, string $repo, string $state = 'all', int $perPage = 100): array
    {
        /** @var array<int, array<string, mixed>> $response */
        $response = $this->get("/repos/{$owner}/{$repo}/issues", [
            'state' => $state,
            'per_page' => $perPage,
        ]);

        return array_values(array_filter($response, function ($item) {
            return ! isset($item['pull_request']);
        }));
    }

    /**
     * Obtener detalles de un repositorio.
     *
     * @return array<string, mixed>
     */
    public function getRepository(string $owner, string $repo): array
    {
        return $this->get("/repos/{$owner}/{$repo}");
    }

    /**
     * Obtener un solo commit por SHA.
     *
     * @return array<string, mixed>
     */
    public function getCommit(string $owner, string $repo, string $sha): array
    {
        return $this->get("/repos/{$owner}/{$repo}/commits/{$sha}");
    }

    /**
     * @param  array<string, mixed>  $commitData
     */
    public function getAuthorIdFromCommit(array $commitData): ?int
    {
        $email = $commitData['commit']['author']['email'] ?? null;

        if ($email) {
            $user = User::whereEmail($email)->first();
            if ($user) {
                return $user->id;
            }
        }

        $githubId = $commitData['author']['id'] ?? null;

        if ($githubId) {
            $user = User::whereGithubId($githubId)->first();
            if ($user) {
                return $user->id;
            }
        }

        $username = $commitData['author']['login'] ?? null;

        if ($username) {
            $user = User::whereGithubUsername($username)->first();
            if ($user) {
                return $user->id;
            }
        }

        return null;
    }

    /**
     * Obtener todas las revisiones de un pull request.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPullRequestReviews(string $owner, string $repo, int $pullNumber): array
    {
        /** @var array<int, array<string, mixed>> $response */
        $response = $this->get("/repos/{$owner}/{$repo}/pulls/{$pullNumber}/reviews");

        return $response;
    }

    /**
     * Obtener una revisión específica.
     *
     * @return array<string, mixed>
     */
    public function getPullRequestReview(string $owner, string $repo, int $pullNumber, int $reviewId): array
    {
        return $this->get("/repos/{$owner}/{$repo}/pulls/{$pullNumber}/reviews/{$reviewId}");
    }

    /**
     * Obtener todos los repositorios de una cuenta de GitHub.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getUserRepositories(string $username): array
    {
        $repos = [];
        $page = 1;
        $perPage = 100;

        do {
            /** @var array<int, array<string, mixed>> $response */
            $response = $this->get("/users/{$username}/repos", [
                'per_page' => $perPage,
                'page' => $page,
                'sort' => 'updated',
                'direction' => 'desc',
            ]);

            if (empty($response)) {
                break;
            }

            $repos = array_merge($repos, $response);
            $page++;
        } while (count($response) === $perPage);

        return $repos;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getPullRequestCommits(string $owner, string $repo, int $prNumber): array
    {
        /** @var array<int, array<string, mixed>> $response */
        $response = $this->get("/repos/{$owner}/{$repo}/pulls/{$prNumber}/commits");

        return $response;
    }
}
