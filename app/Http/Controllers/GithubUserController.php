<?php

namespace App\Http\Controllers;

use App\Enums\ActivityTypeEnum;
use App\Http\Requests\BulkDestroyRequest;
use App\Http\Resources\GithubUserResource;
use App\Models\GithubUser;
use App\Services\ActivityLoggerService;
use App\Services\GithubUserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GithubUserController extends Controller
{
    private GithubUserService $service;

    public function __construct(GithubUserService $service)
    {
        $this->service = $service;
    }

    public function all(): AnonymousResourceCollection
    {
        return GithubUserResource::collection($this->service->index());
    }

    public function sync(int $id): RedirectResponse
    {
        try {
            $user = GithubUser::findOrFail($id);
            $this->service->syncFromGithub($user->username);

            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Synced,
                'GitHub user sync completed',
            );

            return redirect()->back();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'sync' => 'Sync failed: '.$e->getMessage(),
            ]);
        }
    }

    public function import(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|max:100',
            ]);
            $username = $validated['username'];

            $this->service->syncFromGithub($username);

            app(ActivityLoggerService::class)->log(
                ActivityTypeEnum::Imported,
                'GitHub user imported: '.$username,
                changes: ['username' => $username],
            );

            return redirect()->back();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'username' => 'Import failed: '.$e->getMessage(),
            ]);
        }
    }

    public function index(Request $request): Response
    {
        $data = GithubUserResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['inactive']);

        return Inertia::render('github-user/index', [
            'list' => $data,
            'title' => 'GitHub Users',
            'filters' => $filters,
        ]);
    }

    public function show(GithubUser $githubUser): GithubUserResource
    {
        return new GithubUserResource($this->service->show($githubUser->id));
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'GitHub user deleted successfully!');
    }

    public function bulkDestroy(BulkDestroyRequest $request): RedirectResponse
    {
        $this->service->bulkDestroy($request->validated()['ids']);

        return redirect()->back()
            ->with('success', 'Deleted successfully!');
    }
}
