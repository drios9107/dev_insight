<?php

namespace App\Services;

use App\Models\GithubUser;
use Illuminate\Http\Request;

class GithubUserService
{
    public function syncFromGithub(GithubService $githubService, string $username): GithubUser
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
                'last_synced_at' => now(),
            ]
        );
    }

    public function index(?Request $request = null)
    {
        $query = GithubUser::query()
            ->withCount([
                'commits',
                'authoredPullRequests',
                'pullRequestReviews',
                'githubIssues',
            ]);

        if ($request && $request->filled('search')) {
            $search = '%'.$request->search.'%';
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
        $attributes = [
            'username' => $githubData['login'],
            'avatar_url' => $githubData['avatar_url'] ?? null,
            'last_synced_at' => now(),
        ];

        if (isset($githubData['email'])) {
            $attributes['email'] = $githubData['email'];
        }
        if (isset($githubData['name'])) {
            $attributes['name'] = $githubData['name'];
        }

        $user = GithubUser::where('github_id', $githubData['id'])->first();
        if ($user) {
            $user->update($attributes);

            return $user;
        }

        if (isset($githubData['email'])) {
            $user = GithubUser::where('email', $githubData['email'])->first();
            if ($user) {
                $user->update([
                    ...$attributes,
                    'github_id' => $githubData['id'],
                ]);

                return $user;
            }
        }

        return GithubUser::create([
            ...$attributes,
            'github_id' => $githubData['id'],
        ]);
    }

    /**
     * Display the specified item.
     */
    public function show(int $id): GithubUser
    {
        return GithubUser::with(['teams'])
            ->withCount([
                'commits',
                'authoredPullRequests',
                'pullRequestReviews',
                'githubIssues',
            ])
            ->findOrFail($id);
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
