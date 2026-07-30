<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection($this->userService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        return new UserResource($this->userService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new UserResource($this->userService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, int $id)
    {
        return new UserResource($this->userService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->userService->destroy($id);

        return response()->json(null, 204);
    }
}
