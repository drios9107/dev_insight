<?php

namespace App\Services;

use App\Models\GithubIssue;
use App\Models\GithubRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GithubIssueService extends BaseGithubService
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
     * Fetch issues from GitHub and upsert them into the database.
     *
     * @return array{success: bool, message: string, count?: int}
     *
     * @throws \Exception
     */
    public function fetchData(string $ownerKey, string $repoName): array
    {
        $issues = $this->github->getIssues($ownerKey, $repoName);

        if (empty($issues)) {
            return [
                'success' => false,
                'message' => 'No issues found',
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
        $data = array_map(function (array $issue) use ($repoId): array {
            $author = null;

            if (isset($issue['user']['id'])) {
                $author = $this->githubUserService->findOrCreate($issue['user']);
            }

            return [
                'github_id' => $issue['id'],
                'github_repository_id' => $repoId,
                'number' => $issue['number'],
                'title' => $issue['title'],
                'body' => $issue['body'] ?? null,
                'state' => $issue['state'],
                'author_id' => $author?->id,
                'closed_at' => $issue['closed_at'] ?? null,
                'created_at' => date('Y-m-d H:i:s', strtotime($issue['created_at'])),
                'updated_at' => date('Y-m-d H:i:s', strtotime($issue['updated_at'])),
            ];
        }, $issues);

        DB::table('github_issues')->upsert(
            $data,
            ['github_id'],
            ['github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'closed_at', 'updated_at'],
        );

        return [
            'success' => true,
            'message' => 'Issues synced',
            'count' => count($data),
        ];
    }

    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, GithubIssue>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = GithubIssue::query()
            ->with('author', 'githubRepository', 'task');

        if ($request?->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                    ->orWhere('body', 'ilike', $search)
                    ->orWhereHas('author', function ($a) use ($search) {
                        $a->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('githubRepository', function ($r) use ($search) {
                        $r->where('full_name', 'ilike', $search);
                    });
            });
        }

        if ($request?->filled('state') && $request->state !== 'all') {
            $query->where('state', $request->state);
        }

        if ($request?->filled('repository_id') && $request->repository_id !== 'all') {
            $query->where('github_repository_id', $request->repository_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): GithubIssue
    {
        return GithubIssue::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return GithubIssue
     */
    public function show($id)
    {
        $item = GithubIssue::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return GithubIssue::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return GithubIssue::destroy($id) > 0;
    }
}
