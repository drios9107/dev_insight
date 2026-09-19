<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PullRequestService
{
    private GithubUserService $githubUserService;

    public function __construct(GithubUserService $githubUserService)
    {
        $this->githubUserService = $githubUserService;
    }

    public function fetchData(GithubService $service, string $state = 'all', string $ownerKey = 'drios9107', string $repoName = 'expenses')
    {
        $prs = $service->getPullRequests($ownerKey, $repoName, $state);

        if (empty($prs)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron pull requests',
            ]);
        }

        $repo = $service->getRepository($ownerKey, $repoName);
        $repoId = GithubRepository::whereGithubId($repo['id'])->value('id');

        $data = array_map(function ($pr) use ($repoId) {

            $author = null;
            if (isset($pr['user']) && isset($pr['user']['id'])) {
                $author = $this->githubUserService->findOrCreate($pr['user']);
            }


            $assigneeIds = [];
            if (isset($pr['assignees']) && is_array($pr['assignees'])) {
                foreach ($pr['assignees'] as $assigneeData) {
                    if (isset($assigneeData['id'])) {
                        $assignee = $this->githubUserService->findOrCreate($assigneeData);
                        $assigneeIds[] = $assignee->id;
                    }
                }
            }

            $prState = !empty($pr['merged_at']) ? 'merged' : $pr['state'];

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
                    $prData
                );

                $prId = DB::table('pull_requests')
                    ->where('github_id', $prData['github_id'])
                    ->value('id');

                if (!empty($item['assignee_ids']) && $prId) {
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
                    $this->syncPullRequestCommits($service, $ownerKey, $repoName, $prId, $item['pr_number']);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($data) . ' pull requests sincronizados',
                'count' => count($data),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al sincronizar: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function syncPullRequestCommits(GithubService $service, string $owner, string $repo, int $prId, int $prNumber): void
    {
        try {
            $commits = $service->getPullRequestCommits($owner, $repo, $prNumber);

            foreach ($commits as $commit) {
                DB::table('commits')
                    ->where('sha', $commit['sha'])
                    ->update(['pull_request_id' => $prId]);
            }
        } catch (\Exception $e) {
            Log::warning("Failed to sync commits for PR #{$prNumber}: " . $e->getMessage());
        }
    }

    public function index(?Request $request = null)
    {
        $query = PullRequest::query()->with(['author', 'assignees', 'githubRepository', 'task']);
        if ($request && $request->filled('search')) {
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

        if ($request && $request->boolean('stale')) {
            $query->where('state', 'open')
                ->where('updated_at', '<', now()->subDays(7));
        }

        if ($request && $request->filled('state') && $request->state !== 'all') {
            $query->where('state', $request->state);
        }

        if ($request && $request->filled('repository_id') && $request->repository_id !== 'all') {
            $query->where('github_repository_id', $request->repository_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return PullRequest::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return PullRequest::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return PullRequest::destroy($id) !== null;
    }
}
