<?php

namespace App\Http\Controllers;

use App\Http\Resources\GithubUserResource;
use App\Services\GithubUserService;
use Illuminate\Http\Request;
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

    public function index(Request $request)
    {
        $data = GithubUserResource::collection($this->service->index($request));

        return Inertia::render('github-user/index', [
            'list' => $data,
            'title' => 'GitHub Users',
        ]);
    }

    public function show(int $id)
    {
        $user = $this->service->show($id);

        return Inertia::render('github-user/show', [
            'user' => new GithubUserResource($user),
            'title' => 'GitHub User Details',
        ]);
    }

    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'GitHub user deleted successfully!');
    }
}
