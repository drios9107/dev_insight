<?php

namespace App\Services;

use App\Models\Commit;
use App\Models\GithubRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommitService
{
    private GithubUserService $githubUserService;

    public function __construct(GithubUserService $githubUserService)
    {
        $this->githubUserService = $githubUserService;
    }

    public function fetchData(GithubService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses')
    {
        $commits = $service->getCommits($ownerKey, $repoName);

        if (empty($commits)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron commits',
            ]);
        }

        $repo = $service->getRepository($ownerKey, $repoName);
        $repoId = GithubRepository::whereGithubId($repo['id'])->value('id');

        $data = array_map(function ($commit) use ($repoId) {
            $author = null;
            if (isset($commit['author']) && isset($commit['author']['id'])) {
                $author = $this->githubUserService->findOrCreate($commit['author']);
            }

            $sha = $commit['sha'];

            return [
                'sha' => $sha,
                'github_repository_id' => $repoId,
                'author_id' => $author?->id,
                // @todo: define task source
                'task_id' => null,
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
            ['github_repository_id', 'author_id', 'task_id', 'message', 'date', 'url', 'updated_at']
        );

        return response()->json([
            'success' => true,
            'message' => 'Commits sincronizados',
            'count' => count($data),
        ]);
    }

    public function index(?Request $request = null)
    {
        $query = Commit::query()
            ->with(['author', 'githubRepository', 'task']);

        if ($request && $request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('message', 'ilike', $search)
                    ->orWhere('sha', 'ilike', $search)
                    ->orWhereHas('author', function ($a) use ($search) {
                        $a->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('githubRepository', function ($r) use ($search) {
                        $r->where('full_name', 'ilike', $search);
                    });
            });
        }

        if ($request && $request->filled('repository_id') && $request->repository_id !== 'all') {
            $query->where('github_repository_id', $request->repository_id);
        }

        return $query->latest('date')->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return Commit::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return Commit::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return Commit::destroy($id) !== null;
    }
}
