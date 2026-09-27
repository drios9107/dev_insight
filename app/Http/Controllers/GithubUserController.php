<?php

namespace App\Http\Controllers;

use App\Http\Resources\GithubUserResource;
use App\Models\GithubUser;
use App\Services\GithubService;
use App\Services\GithubUserService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class GithubUserController extends Controller
{
    private GithubUserService $service;

    public function __construct(GithubUserService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        return GithubUserResource::collection($this->service->index());
    }

    public function import(GithubService $githubService, Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|max:100',
            ]);

            $user = $this->service->importFromGithub($githubService, $validated['username']);

            return redirect()->back();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'username' => $e->getMessage(),
            ]);
        }
    }

    public function index(Request $request)
    {
        $data = GithubUserResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['inactive']);

        return Inertia::render('github-user/index', [
            'list' => $data,
            'title' => 'GitHub Users',
            'filters' => $filters,
        ]);
    }

    public function show(GithubUser $githubUser)
    {
        return new GithubUserResource($this->service->show($githubUser->id));
    }

    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'GitHub user deleted successfully!');
    }
}
