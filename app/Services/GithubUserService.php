<?php

namespace App\Services;

use App\Models\GithubUser;
use Illuminate\Http\Request;

class GithubUserService
{
    public function importFromGithub(GithubService $githubService, string $username): GithubUser
    {
        $githubUser = $githubService->getUser($username);

        if ($githubUser === null) {
            throw new \Exception("GitHub user '{$username}' not found");
        }

        return GithubUser::updateOrCreate(
            ['github_id' => $githubUser['id']],
            [
                'username' => $githubUser['login'],
                'email' => $githubUser['email'] ?? null,
                'name' => $githubUser['name'] ?? null,
                'avatar_url' => $githubUser['avatar_url'] ?? null,
                'meta' => $githubUser,
                'last_synced_at' => now(),
            ]
        );
    }

    public function index(?Request $request = null)
    {
        $query = GithubUser::query();

        if ($request && $request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('username', 'ilike', $search)
                    ->orWhere('name', 'ilike', $search)
                    ->orWhere('email', 'ilike', $search);
            });
        }

        if ($request && $request->boolean('inactive')) {
            $query->whereDoesntHave('commits', function ($q) {
                $q->where('date', '>=', now()->subDays(7));
            });
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    public function findOrCreate(array $githubData): GithubUser
    {
        $user = GithubUser::where('github_id', $githubData['id'])->first();

        if ($user) {
            $user->update([
                'username' => $githubData['login'],
                'email' => $githubData['email'] ?? $user->email,
                'name' => $githubData['name'] ?? $user->name,
                'avatar_url' => $githubData['avatar_url'] ?? $user->avatar_url,
            ]);

            return $user;
        }

        if (isset($githubData['email'])) {
            $user = GithubUser::where('email', $githubData['email'])->first();
            if ($user) {
                $user->update([
                    'github_id' => $githubData['id'],
                    'username' => $githubData['login'],
                    'avatar_url' => $githubData['avatar_url'] ?? null,
                ]);

                return $user;
            }
        }

        return GithubUser::create([
            'github_id' => $githubData['id'],
            'username' => $githubData['login'],
            'email' => $githubData['email'] ?? null,
            'name' => $githubData['name'] ?? null,
            'avatar_url' => $githubData['avatar_url'] ?? null,
        ]);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     */
    public function show(int $id): GithubUser
    {
        return GithubUser::withCount([
            'commits',
            'authoredPullRequests',
            'pullRequestReviews',
            'githubIssues',
        ])->findOrFail($id);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     */
    public function destroy($id): bool
    {
        return GithubUser::destroy($id) !== null;
    }

    public function getByGithubId(int $githubId): ?GithubUser
    {
        return GithubUser::where('github_id', $githubId)->first();
    }
}
