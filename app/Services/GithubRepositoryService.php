<?php

namespace App\Services;

use App\Enums\ActivityTypeEnum;
use App\Models\GithubRepository;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GithubRepositoryService extends BaseGithubService
{
    /**
     * Fetch repository data from the seeder.
     *
     * @return array{success: bool, message: string, repository?: string, count?: int}
     *
     * @throws \Exception
     */
    public function fetchData(string $ownerKey, string $repoName): array
    {
        $repo = $this->github->getRepository($ownerKey, $repoName);

        if (empty($repo)) {
            return [
                'success' => false,
                'message' => 'Repository not found',
            ];
        }

        DB::table('github_repositories')->updateOrInsert(
            ['github_id' => $repo['id']],
            [
                'github_id' => $repo['id'],
                'name' => $repo['name'],
                'full_name' => $repo['full_name'],
                'url' => $repo['html_url'],
                'description' => $repo['description'] ?? null,
                'default_branch' => $repo['default_branch'],
                'is_private' => $repo['private'],
                'last_synced_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        return [
            'success' => true,
            'message' => 'Repository synced',
            'repository' => $repo['full_name'],
            'count' => 1,
        ];
    }

    /**
     * Sync every public repository in a github account.
     *
     * @return array<string, int>
     *
     * @throws \Exception
     */
    public function syncAllFromGithub(string $username): array
    {
        $user = $this->github->getUser($username);
        if ($user === null) {
            throw new \Exception("GitHub user '{$username}' not found");
        }

        $repos = $this->github->getUserRepositories($username);
        if (empty($repos)) {
            throw new \Exception("GitHub user '{$username}' has no public repositories");
        }

        $results = [
            'created' => 0,
            'updated' => 0,
            'total' => count($repos),
        ];

        foreach ($repos as $repo) {
            $repository = GithubRepository::updateOrCreate(
                ['github_id' => $repo['id']],
                [
                    'name' => $repo['name'],
                    'full_name' => $repo['full_name'],
                    'url' => $repo['html_url'],
                    'description' => $repo['description'] ?? null,
                    'default_branch' => $repo['default_branch'],
                    'is_private' => $repo['private'],
                    'language' => $repo['language'] ?? null,
                    'stars_count' => $repo['stargazers_count'] ?? 0,
                    'forks_count' => $repo['forks_count'] ?? 0,
                    'last_synced_at' => now(),
                ]
            );

            if ($repository->wasRecentlyCreated) {
                $results['created']++;
            } else {
                $results['updated']++;
            }
        }

        return $results;
    }

    /**
     * Obtener atributos del repo desde la API de GitHub.
     *
     * @return array<string, mixed>
     *
     * @throws Exception
     */
    protected function fetchRepositoryAttributes(string $owner, string $repoName): array
    {
        $response = $this->github->getRepository($owner, $repoName);

        return [
            'github_id' => $response['id'],
            'name' => $response['name'],
            'full_name' => $response['full_name'],
            'url' => $response['html_url'],
            'description' => $response['description'] ?? null,
            'is_private' => $response['private'] ?? false,
            'default_branch' => $response['default_branch'] ?? 'main',
        ];
    }

    /**
     * Import a gitHub repository.
     *
     * @param  string  $owner
     * @param  string  $repoName
     * @return GithubRepository
     *
     * @throws Exception
     */
    public function import(string $owner, string $repoName): GithubRepository
    {
        $repository = GithubRepository::firstOrCreate(
            ['full_name' => "{$owner}/{$repoName}"],
            $this->fetchRepositoryAttributes($owner, $repoName),
        );

        $this->syncRepository($repository);

        app(ActivityLoggerService::class)->log(
            ActivityTypeEnum::Imported,
            'Repository imported from GitHub',
            changes: ['owner_key' => $owner, 'repo_name' => $repoName],
        );

        return $repository;
    }

    /**
     * Sincronizar un repositorio completo (commits, PRs, issues, reviews).
     *
     * @return array<string, bool>
     *
     * @throws Exception
     */
    public function syncRepository(GithubRepository $repository): array
    {
        [$owner, $repoName] = explode('/', $repository->full_name);

        $results = [
            'commits' => false,
            'pull_requests' => false,
            'issues' => false,
            'reviews' => false,
        ];

        try {
            app(CommitService::class)->fetchData($owner, $repoName);
            $results['commits'] = true;

            app(PullRequestService::class)->fetchData('all', $owner, $repoName);
            $results['pull_requests'] = true;

            app(GithubIssueService::class)->fetchData($owner, $repoName);
            $results['issues'] = true;

            app(PullRequestReviewService::class)->fetchData($owner, $repoName);
            $results['reviews'] = true;

            $repository->update(['last_synced_at' => now()]);

            Log::info("Repository synced: {$repository->full_name}", $results);

            return $results;
        } catch (Exception $e) {
            Log::error("Sync failed for {$repository->full_name}: " . $e->getMessage());

            throw $e;
        }
    }

    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, GithubRepository>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = GithubRepository::query();

        if ($request?->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'ilike', $search)
                    ->orWhere('name', 'ilike', $search)
                    ->orWhere('description', 'ilike', $search);
            });
        }

        if ($request && $request->has('is_private') && $request->is_private !== 'all') {
            $query->where('is_private', $request->is_private === '1');
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): GithubRepository
    {
        return GithubRepository::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return GithubRepository
     */
    public function show($id)
    {
        $item = GithubRepository::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return GithubRepository::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return GithubRepository::destroy($id) > 0;
    }
}
