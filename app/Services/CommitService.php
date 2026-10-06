<?php

namespace App\Services;

use App\Models\Commit;
use App\Models\GithubRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommitService extends BaseGithubService
{
    private GithubUserService $githubUserService;

    public function __construct(
        GithubService $github,
        GithubUserService $githubUserService,
    ) {
        parent::__construct($github);
        $this->githubUserService = $githubUserService;
    }

    /**
     * Fetch commits from GitHub and upsert them into the database.
     *
     * @return array{success: bool, message: string, count?: int}
     *
     * @throws \Exception
     */
    public function fetchData(string $ownerKey, string $repoName): array
    {
        $commits = $this->github->getCommits($ownerKey, $repoName);

        if (empty($commits)) {
            return [
                'success' => false,
                'message' => 'No commits found',
            ];
        }

        $repo = $this->github->getRepository($ownerKey, $repoName);

        $repoId = GithubRepository::whereGithubId($repo['id'])->value('id');

        if ($repoId === null) {
            return [
                'success' => false,
                'message' => 'Repository not found in database',
            ];
        }

        /** @var array<int, array<string, mixed>> $data */
        $data = array_map(function (array $commit) use ($repoId): array {
            $author = null;

            if (isset($commit['author']['id'])) {
                $author = $this->githubUserService->findOrCreate($commit['author']);
            }

            return [
                'sha' => $commit['sha'],
                'github_repository_id' => $repoId,
                'author_id' => $author?->id,
                'pull_request_id' => null,
                'message' => $commit['commit']['message'],
                'date' => date('Y-m-d H:i:s', strtotime($commit['commit']['author']['date'])),
                'url' => $commit['html_url'] ?? '',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $commits);

        DB::table('commits')->upsert(
            $data,
            ['sha'],
            ['github_repository_id', 'author_id', 'message', 'date', 'url', 'updated_at'],
        );

        return [
            'success' => true,
            'message' => 'Commits synced',
            'count' => count($data),
        ];
    }

    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, Commit>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = Commit::query()
            ->with(['author', 'githubRepository', 'pullRequest']);

        if ($request?->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('message', 'ilike', $search)
                    ->orWhere('sha', 'ilike', $search)
                    ->orWhereHas('author', function ($a) use ($search) {
                        $a->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('githubRepository', function ($r) use ($search) {
                        $r->where('full_name', 'ilike', $search);
                    })
                    ->orWhereHas('pullRequest', function ($r) use ($search) {
                        $r->where('title', 'ilike', $search);
                    });
            });
        }

        if ($request?->filled('repository_id') && $request->repository_id !== 'all') {
            $query->where('github_repository_id', $request->repository_id);
        }

        if ($request?->filled('pull_request_id') && $request->pull_request_id !== 'all') {
            $query->where('pull_request_id', $request->pull_request_id);
        }

        return $query->latest('date')->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Commit
    {
        return Commit::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return Commit
     */
    public function show($id)
    {
        $item = Commit::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return Commit::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Commit::destroy($id) > 0;
    }
}
