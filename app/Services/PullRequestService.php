<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            // Author
            $author = null;
            if (isset($pr['user']) && isset($pr['user']['id'])) {
                $author = $this->githubUserService->findOrCreate($pr['user']);
            }

            // Assignees
            $assigneeIds = [];
            if (isset($pr['assignees']) && is_array($pr['assignees'])) {
                foreach ($pr['assignees'] as $assigneeData) {
                    if (isset($assigneeData['id'])) {
                        $assignee = $this->githubUserService->findOrCreate($assigneeData);
                        $assigneeIds[] = $assignee->id;
                    }
                }
            }

            return [
                'pull_request_data' => [
                    'github_id' => $pr['id'],
                    'github_repository_id' => $repoId,
                    'number' => $pr['number'],
                    'title' => $pr['title'],
                    'body' => $pr['body'] ?? null,
                    'state' => $pr['state'],
                    'author_id' => $author?->id,
                    'base_branch' => $pr['base']['ref'] ?? 'main',
                    'head_branch' => $pr['head']['ref'] ?? 'feature',
                    // @todo: define task source
                    'task_id' => null,
                    'closed_at' => $pr['closed_at'] ?? null,
                    'merged_at' => $pr['merged_at'] ?? null,
                    'merge_commit_sha' => $pr['merge_commit_sha'] ?? null,
                    'created_at' => date('Y-m-d H:i:s', strtotime($pr['created_at'])),
                    'updated_at' => date('Y-m-d H:i:s', strtotime($pr['updated_at'])),
                ],
                'assignee_ids' => $assigneeIds,
            ];
        }, $prs);
        DB::beginTransaction();

        try {
            foreach ($data as $item) {
                $prData = $item['pull_request_data'];

                // Insertar o actualizar PR
                DB::table('pull_requests')->updateOrInsert(
                    ['github_id' => $prData['github_id']],
                    $prData
                );

                // Sincronizar assignees
                if (! empty($item['assignee_ids'])) {

                    $prId = DB::table('pull_requests')
                        ->where('github_id', $prData['github_id'])
                        ->value('id');

                    if ($prId) {
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
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($data).' pull requests sincronizados',
                'count' => count($data),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al sincronizar: '.$e->getMessage(),
            ], 500);
        }
    }

    public function index(?Request $request = null)
    {
        $query = PullRequest::query()->with(['author', 'assignees', 'githubRepository', 'task']);
        if ($request && $request->filled('search')) {
            $search = '%'.$request->search.'%';
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
