<?php

namespace App\Services;

use App\Models\PullRequest;
use Illuminate\Support\Facades\DB;

class PullRequestService
{
    public function fetchData(GithubService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses')
    {
        $prs = $service->getPullRequests($ownerKey, $repoName);

        if (empty($prs)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron pull requests',
            ]);
        }

        $repo = $service->getRepository($ownerKey, $repoName);
        $repoId = $repo['id'];

        $data = array_map(function ($pr) use ($repoId) {
            return [
                'github_id' => $pr['id'],
                'github_repository_id' => $repoId,
                'number' => $pr['number'],
                'title' => $pr['title'],
                'body' => $pr['body'] ?? null,
                'state' => $pr['state'],
                'author_id' => null,
                'assignee_id' => null,
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

    public function index()
    {
        return PullRequest::all();
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
