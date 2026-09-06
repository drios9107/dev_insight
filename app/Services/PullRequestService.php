<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PullRequestService
{
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
            $authorId = User::whereGithubId($pr['user']['id'] ?? null)->first()->value('id');
            $assigneeId = User::whereGithubId($pr['assignees'][0]['id'] ?? null)->first()->value('id');

            return [
                'github_id' => $pr['id'],
                'github_repository_id' => $repoId,
                'number' => $pr['number'],
                'title' => $pr['title'],
                'body' => $pr['body'] ?? null,
                'state' => $pr['state'],
                // @todo:find assignee and author
                'author_id' => $authorId,
                'assignee_id' => $assigneeId,
                'base_branch' => $pr['base']['ref'] ?? 'main',
                'head_branch' => $pr['head']['ref'] ?? 'feature',
                'task_id' => null,
                'closed_at' => $pr['closed_at'] ?? null,
                'merged_at' => $pr['merged_at'] ?? null,
                'merge_commit_sha' => $pr['merge_commit_sha'] ?? null,
                'created_at' => date('Y-m-d H:i:s', strtotime($pr['created_at'])),
                'updated_at' => date('Y-m-d H:i:s', strtotime($pr['updated_at'])),
            ];
        }, $prs);

        DB::table('pull_requests')->upsert(
            $data,
            ['github_id'],
            ['github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'assignee_id', 'base_branch', 'head_branch', 'task_id', 'closed_at', 'merged_at', 'merge_commit_sha', 'updated_at']
        );

        return response()->json([
            'success' => true,
            'message' => count($data).' pull requests sincronizados',
            'count' => count($data),
        ]);
    }

    public function index(?Request $request = null)
    {
        $query = PullRequest::query()->with(['author', 'assignee', 'githubRepository', 'task']);

        if ($request && $request->filled('search')) {
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
