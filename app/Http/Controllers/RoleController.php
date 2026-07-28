<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return RoleResource::collection($this->roleService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        return new RoleResource($this->roleService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new RoleResource($this->roleService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, int $id)
    {
        return new RoleResource($this->roleService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->roleService->destroy($id);

        return response()->json(null, 204);
    }
}
