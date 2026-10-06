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
        $url = $this->apiBase . $endpoint;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/vnd.github.v3+json',
        ])->get($url, $params);

        if ($response->failed()) {
            Log::error('GitHub API error', [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new Exception('GitHub API error: ' . $response->status());
        }

        /** @var array<int|string, mixed> $data */
        $data = $response->json() ?? [];

        return $data;
    }

    /**
     * Fetch a GitHub user by username.
     *
     * @return array<string, mixed>|null
     */
    public function getUser(string $username): ?array
    {
        try {
            /** @var array<string, mixed> $user */
            $user = $this->get("/users/{$username}");

            return $user;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    public function getCommits(string $owner, string $repo): array
    {
        return $this->getAllPages("/repos/{$owner}/{$repo}/commits");
    }

    /**
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    public function getPullRequests(string $owner, string $repo, string $state = 'all'): array
    {
        return $this->getAllPages("/repos/{$owner}/{$repo}/pulls", [
            'state' => $state,
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    public function getIssues(string $owner, string $repo, string $state = 'all'): array
    {
        $all = $this->getAllPages("/repos/{$owner}/{$repo}/issues", [
            'state' => $state,
        ]);

        return array_values(array_filter(
            $all,
            fn(array $item): bool => ! isset($item['pull_request']),
        ));
    }

    /**
     * Fetch a repository from GitHub.
     *
     * @return array<string, mixed>
     *
     * @throws \Exception
     */
    public function getRepository(string $owner, string $repo): array
    {
        return $this->get("/repos/{$owner}/{$repo}");
    }

    /**
     * Fetch a single commit by SHA.
     *
     * @return array<string, mixed>
     *
     * @throws \Exception
     */
    public function getCommit(string $owner, string $repo, string $sha): array
    {
        return $this->get("/repos/{$owner}/{$repo}/commits/{$sha}");
    }

    /**
     * @param  array{
     *     commit?: array{author?: array{email?: string|null}},
     *     author?: array{id?: int|null, login?: string|null}
     * }  $commitData
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
     * Fetch all reviews for a pull request.
     *
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    public function getPullRequestReviews(string $owner, string $repo, int $pullNumber): array
    {
        return $this->getAllPages("/repos/{$owner}/{$repo}/pulls/{$pullNumber}/reviews");
    }

    /**
     * Fetch a single pull request review.
     *
     * @return array<string, mixed>
     *
     * @throws \Exception
     */
    public function getPullRequestReview(string $owner, string $repo, int $pullNumber, int $reviewId): array
    {
        return $this->get("/repos/{$owner}/{$repo}/pulls/{$pullNumber}/reviews/{$reviewId}");
    }

    /**
     * Fetch all repositories for a GitHub account.
     *
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    public function getUserRepositories(string $username): array
    {
        return $this->getAllPages("/users/{$username}/repos", [
            'sort' => 'updated',
            'direction' => 'desc',
        ]);
    }

    /**
     * Fetch all commits for a pull request.
     *
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    public function getPullRequestCommits(string $owner, string $repo, int $prNumber): array
    {
        return $this->getAllPages("/repos/{$owner}/{$repo}/pulls/{$prNumber}/commits");
    }

    /**
     * Fetch all pages from a paginated GitHub endpoint.
     *
     * @param  array<string, mixed>  $query
     * @return array<int, array<string, mixed>>
     *
     * @throws \Exception
     */
    private function getAllPages(string $url, array $query = []): array
    {
        $all = [];
        $page = 1;
        $perPage = 100;

        while (true) {
            /** @var array<int, array<string, mixed>> $response */
            $response = $this->get($url, array_merge($query, [
                'per_page' => $perPage,
                'page' => $page,
            ]));

            if (empty($response)) {
                break;
            }

            $all = array_merge($all, $response);

            // last page: less than maximum value
            if (count($response) < $perPage) {
                break;
            }

            $page++;
        }

        return $all;
    }
}
