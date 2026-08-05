<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use Inertia\Inertia;

class RoleController extends Controller
{
    private RoleService $service;

    public function __construct(RoleService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return RoleResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = RoleResource::collection($this->service->index());

        return Inertia::render('role/index', [
            'list' => $data,
            'title' => 'Roles',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('role.index')
            ->with('success', 'Role created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('role.index')
            ->with('success', 'Role updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Role deleted successfully!');
    }
}
