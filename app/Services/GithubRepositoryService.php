<?php

namespace App\Services;

use App\Models\GithubRepository;
use Illuminate\Support\Facades\DB;

class GithubRepositoryService
{
    public function fetchData(GithubService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses')
    {
        $repo = $service->getRepository($ownerKey, $repoName);

        if (empty($repo)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró el repositorio',
            ]);
        }

        $data = [
            'github_id' => $repo['id'],
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
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('github_repositories')->updateOrInsert(
            ['github_id' => $repo['id']],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => 'Repositorio sincronizado',
            'repository' => $repo['full_name'],
        ]);
    }

    public function index()
    {
        return GithubRepository::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return GithubRepository::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return GithubRepository::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return GithubRepository::destroy($id) !== null;
    }
}
