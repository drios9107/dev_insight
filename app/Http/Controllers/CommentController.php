<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\CommentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    private CommentService $service;

    public function __construct(CommentService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        return CommentResource::collection($this->service->index());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = CommentResource::collection($this->service->index($request));

        return Inertia::render('comment/index', [
            'list' => $data,
            'title' => 'Comments',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CommentRequest $request)
    {
        $validated = $request->validated();

        $this->service->store($validated);

        return redirect()->route('comment.index')
            ->with('success', 'Comment created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CommentRequest $request, int $id)
    {
        $validated = $request->validated();

        $this->service->update($id, $validated);

        return redirect()->route('comment.index')
            ->with('success', 'Comment updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->destroy($id);

        return redirect()->back()->with('success', 'Comment deleted successfully!');
    }
}
