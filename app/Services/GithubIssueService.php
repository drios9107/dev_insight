<?php

namespace App\Services;

use App\Models\GithubIssue;
use App\Models\GithubRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GithubIssueService
{
    public function fetchData(GithubService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses')
    {
        $issues = $service->getIssues($ownerKey, $repoName);

        if (empty($issues)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron pull requests',
            ]);
        }

        $repo = $service->getRepository($ownerKey, $repoName);
        $repoId = GithubRepository::whereGithubId($repo['id'])->value('id');

        $data = array_map(function ($issue) use ($repoId) {

            return [
                'github_id' => $issue['id'],
                'github_repository_id' => $repoId,
                'number' => $issue['number'],
                'title' => $issue['title'],
                'body' => $issue['body'] ?? null,
                'state' => $issue['state'],
                'author_id' => null,
                'closed_at' => $issue['closed_at'] ?? null,
                'created_at' => date('Y-m-d H:i:s', strtotime($issue['created_at'])),
                'updated_at' => date('Y-m-d H:i:s', strtotime($issue['updated_at'])),
            ];
        }, $issues);

        DB::table('github_issues')->upsert(
            $data,
            ['github_id'],
            ['github_repository_id', 'number', 'title', 'body', 'state', 'author_id', 'closed_at', 'updated_at']
        );

        return response()->json([
            'success' => true,
            'message' => 'Issues sincronizados',
            'count' => count($data),
        ]);
    }

    public function index(?Request $request = null)
    {
        $query = GithubIssue::query();

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
        return GithubIssue::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return GithubIssue::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return GithubIssue::destroy($id) !== null;
    }
}
