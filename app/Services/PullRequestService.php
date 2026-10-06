<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PullRequestService extends BaseGithubService
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
     * Fetch pull requests from GitHub and sync them into the database.
     *
     * @return array{success: bool, message: string, count?: int}
     *
     * @throws \Exception
     */
    public function fetchData(string $state, string $ownerKey, string $repoName): array
    {
        $prs = $this->github->getPullRequests($ownerKey, $repoName, $state);

        if (empty($prs)) {
            return [
                'success' => false,
                'message' => 'No pull requests found',
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

        /**
         * @var array<int, array{
         *     pull_request_data: array<string, mixed>,
         *     assignee_ids: array<int, int>,
         *     pr_number: int
         * }> $data
         */
        $data = array_map(function (array $pr) use ($repoId): array {
            $author = null;

            if (isset($pr['user']['id'])) {
                $author = $this->githubUserService->findOrCreate($pr['user']);
            }

            $assigneeIds = [];

            foreach ($pr['assignees'] ?? [] as $assigneeData) {
                if (isset($assigneeData['id'])) {
                    $assignee = $this->githubUserService->findOrCreate($assigneeData);
                    $assigneeIds[] = $assignee->id;
                }
            }

            $prState = ! empty($pr['merged_at']) ? 'merged' : $pr['state'];

            return [
                'pull_request_data' => [
                    'github_id' => $pr['id'],
                    'github_repository_id' => $repoId,
                    'number' => $pr['number'],
                    'title' => $pr['title'],
                    'body' => $pr['body'] ?? null,
                    'state' => $prState,
                    'author_id' => $author?->id,
                    'base_branch' => $pr['base']['ref'] ?? 'main',
                    'head_branch' => $pr['head']['ref'] ?? 'feature',
                    'task_id' => null,
                    'closed_at' => $pr['closed_at'] ?? null,
                    'merged_at' => $pr['merged_at'] ?? null,
                    'merge_commit_sha' => $pr['merge_commit_sha'] ?? null,
                    'created_at' => date('Y-m-d H:i:s', strtotime($pr['created_at'])),
                    'updated_at' => date('Y-m-d H:i:s', strtotime($pr['updated_at'])),
                ],
                'assignee_ids' => $assigneeIds,
                'pr_number' => $pr['number'],
            ];
        }, $prs);

        DB::beginTransaction();

        try {
            foreach ($data as $item) {
                $prData = $item['pull_request_data'];

                DB::table('pull_requests')->updateOrInsert(
                    ['github_id' => $prData['github_id']],
                    $prData,
                );

                $prId = DB::table('pull_requests')
                    ->where('github_id', $prData['github_id'])
                    ->value('id');

                if (! empty($item['assignee_ids']) && $prId) {
                    DB::table('pull_request_assignees')
                        ->where('pull_request_id', $prId)
                        ->delete();

                    foreach ($item['assignee_ids'] as $userId) {
                        DB::table('pull_request_assignees')->insert([
                            'pull_request_id' => $prId,
                            'github_user_id' => $userId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                if ($prId) {
                    $this->syncPullRequestCommits($ownerKey, $repoName, $prId, $item['pr_number']);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => count($data) . ' pull requests synced',
                'count' => count($data),
            ];
        } catch (Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }

    private function syncPullRequestCommits(string $owner, string $repo, int $prId, int $prNumber): void
    {
        try {
            $commits = $this->github->getPullRequestCommits($owner, $repo, $prNumber);

            foreach ($commits as $commit) {
                DB::table('commits')
                    ->where('sha', $commit['sha'])
                    ->update(['pull_request_id' => $prId]);
            }
        } catch (\Exception $e) {
            Log::warning("Failed to sync commits for PR #{$prNumber}: " . $e->getMessage());
        }
    }

    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, PullRequest>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = PullRequest::query()->with(['author', 'assignees', 'githubRepository', 'task']);
        if ($request?->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', $search)
                    ->orWhere('body', 'ilike', $search)
                    ->orWhereHas('author', function ($a) use ($search) {
                        $a->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('assignees', function ($a) use ($search) {
                        $a->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('githubRepository', function ($r) use ($search) {
                        $r->where('full_name', 'ilike', $search);
                    });
            });
        }

        if ($request?->boolean('stale')) {
            $query->where('state', 'open')
                ->where('updated_at', '<', now()->subDays(7));
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
    public function store(array $data): PullRequest
    {
        return PullRequest::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return PullRequest
     */
    public function show($id)
    {
        $item = PullRequest::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return PullRequest::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return PullRequest::destroy($id) > 0;
    }
}
