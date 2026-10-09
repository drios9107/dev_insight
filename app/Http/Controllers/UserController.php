<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkDestroyRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private UserService $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all(): AnonymousResourceCollection
    {
        return UserResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $data = UserResource::collection($this->service->index($request));

        $filters = $this->extractFilters($request, ['role_id']);

        $roles = Role::select('id', 'name')->get();

        return Inertia::render('user/index', [
            'list' => $data,
            'title' => 'Users',
            'filters' => $filters,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('user.index')
            ->with('success', 'User created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('user.index')
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'User deleted successfully!');
    }

    public function bulkDestroy(BulkDestroyRequest $request): RedirectResponse
    {
        $this->service->bulkDestroy($request->validated()['ids']);

        return redirect()->back()
            ->with('success', 'Deleted successfully!');
    }
}
