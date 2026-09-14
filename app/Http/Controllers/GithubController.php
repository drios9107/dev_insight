<?php

namespace App\Http\Controllers;

use App\Models\GithubRepository;
use App\Services\GithubService;

class GithubController extends Controller
{
    private GithubService $service;

    public function __construct(GithubService $service)
    {
        $this->service = $service;
    }

    public function sync(int $repositoryId)
    {
        try {
            $repository = GithubRepository::findOrFail($repositoryId);

            $this->service->syncRepository($repository);

            return back()->with('success', 'Repository synced successfully');

        } catch (\Exception $e) {
            return back()->with('error', 'Sync failed: '.$e->getMessage());
        }
    }
}
