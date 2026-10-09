<?php

namespace App\Http\Controllers;

use App\Enums\ActivityTypeEnum;
use App\Http\Requests\BulkDestroyRequest;
use App\Http\Requests\GithubRepositoryRequest;
use App\Http\Resources\GithubRepositoryResource;
use App\Models\GithubRepository;
use App\Services\ActivityLoggerService;
use App\Services\GithubRepositoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GithubRepositoryController extends Controller
{
    private GithubRepositoryService $service;

    public function __construct(GithubRepositoryService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all(): AnonymousResourceCollection
    {
        return GithubRepositoryResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $data = GithubRepositoryResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['is_private']);

        return Inertia::render('github-repository/index', [
            'list' => $data,
            'title' => 'GitHub Repositories',
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GithubRepositoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('github-repository.index')
            ->with('success', 'Github Repository created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GithubRepositoryRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('github-repository.index')
            ->with('success', 'Github Repository updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Github Repository deleted successfully!');
    }

    public function syncAll(Request $request): RedirectResponse
    {
        try {
            $username = $request->input('ownerKey');

            if (! $username) {
                throw new \Exception('No github username was provided');
            }

            $results = $this->service->syncAllFromGithub($username);

            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Synced,
                'Global repository sync completed',
                changes: $results,
            );

            return back()->with('success', sprintf(
                'Synced: %d created, %d updated',
                $results['created'],
                $results['updated']
            ));
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'ownerKey' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Import a GitHub repository and sync its content.
     */
    public function import(Request $request): RedirectResponse
    {
        try {
            $ownerKey = $request->input('owner_key');
            $repoName = $request->input('repo_name');

            if (! $ownerKey || ! $repoName) {
                throw new \Exception('Owner and repository name are required');
            }

            $repository = $this->service->import($ownerKey, $repoName);

            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Imported,
                "Repository «{$repository->full_name}» was imported",
                changes: [
                    'owner_key' => $ownerKey,
                    'repo_name' => $repoName,
                    'repository_id' => $repository->id,
                ],
            );

            return back()->with('success', 'Repository imported successfully');
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'owner_key' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Sync a single repository (commits, PRs, issues, reviews).
     */
    public function sync(int $repositoryId): RedirectResponse
    {
        try {
            $repository = GithubRepository::findOrFail($repositoryId);

            $results = $this->service->syncRepository($repository);

            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Synced,
                'Repository sync completed (issues, commits, users, pr, reviewers)',
                changes: $results,
            );

            return back()->with('success', 'Repository synced successfully');
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'sync' => $e->getMessage(),
            ]);
        }
    }

    public function bulkDestroy(BulkDestroyRequest $request): RedirectResponse
    {
        $this->service->bulkDestroy($request->validated()['ids']);

        return redirect()->back()
            ->with('success', 'Deleted successfully!');
    }
}
