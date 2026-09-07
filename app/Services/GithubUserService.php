<?php

namespace App\Services;

use App\Models\GithubUser;
use Illuminate\Http\Request;

class GithubUserService
{
    public function index(?Request $request = null)
    {
        $query = GithubUser::query();

        if ($request && $request->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('username', 'ilike', $search)
                    ->orWhere('name', 'ilike', $search)
                    ->orWhere('email', 'ilike', $search);
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
                'meta' => $githubData,
                'last_synced_at' => now(),
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
                    'meta' => $githubData,
                    'last_synced_at' => now(),
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
            'meta' => $githubData,
            'last_synced_at' => now(),
        ]);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     */
    public function show($id): GithubUser
    {
        return GithubUser::findOrFail($id);
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
