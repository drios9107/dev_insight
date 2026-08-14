<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GithubService
{
    private string $token;

    private string $apiBase = 'https://api.github.com';

    public function __construct()
    {
        $this->token = config('services.github.token');
    }

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

    public function getCommits(string $owner, string $repo, int $perPage = 100): array
    {
        $response = $this->get("/repos/{$owner}/{$repo}/commits", [
            'per_page' => $perPage,
        ]);

        return $response;
    }

    public function getPullRequests(string $owner, string $repo, string $state = 'all', int $perPage = 100): array
    {
        $response = $this->get("/repos/{$owner}/{$repo}/pulls", [
            'state' => $state,
            'per_page' => $perPage,
        ]);

        return $response;
    }

    /**
     * Obtener issues de un repositorio
     */
    public function getIssues(string $owner, string $repo, string $state = 'all', int $perPage = 100): array
    {
        $response = $this->get("/repos/{$owner}/{$repo}/issues", [
            'state' => $state,
            'per_page' => $perPage,
        ]);

        // Filtrar PRs (se identifican porque tienen el campo 'pull_request')
        return array_values(array_filter($response, function ($item) {
            return ! isset($item['pull_request']);
        }));
    }

    /**
     * Obtener detalles de un repositorio
     */
    public function getRepository(string $owner, string $repo): array
    {
        return $this->get("/repos/{$owner}/{$repo}");
    }

    /**
     * Obtener un solo commit por SHA
     */
    public function getCommit(string $owner, string $repo, string $sha): array
    {
        return $this->get("/repos/{$owner}/{$repo}/commits/{$sha}");
    }

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

    public function getComments() {}
}
