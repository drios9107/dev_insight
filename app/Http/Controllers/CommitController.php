<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitRequest;
use App\Http\Resources\CommitResource;
use App\Services\CommitService;

class CommitController extends Controller
{
    private CommitService $commitService;

    public function __construct(CommitService $commitService)
    {
        $this->commitService = $commitService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CommitResource::collection($this->commitService->index());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CommitRequest $request)
    {
        return new CommitResource($this->commitService->store($request->validated()));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return new CommitResource($this->commitService->show($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CommitRequest $request, int $id)
    {
        return new CommitResource($this->commitService->update($id, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->commitService->destroy($id);

        return response()->noContent();
    }
}
