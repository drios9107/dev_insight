<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PullRequestReviewService
{
    private GithubUserService $githubUserService;

    public function __construct(GithubUserService $githubUserService)
    {
        $this->githubUserService = $githubUserService;
    }

    public function fetchData(GithubService $service, string $ownerKey, string $repoName): JsonResponse
    {
        $repo = $service->getRepository($ownerKey, $repoName);
        $repoId = GithubRepository::whereGithubId($repo['id'])->value('id');

        $prs = PullRequest::whereGithubRepositoryId($repoId)->get();

        if ($prs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron pull requests en el sistema',
            ]);
        }

        $allReviews = [];

        foreach ($prs as $pr) {
            $reviews = $service->getPullRequestReviews($ownerKey, $repoName, $pr->number);

            foreach ($reviews as $review) {
                $reviewer = null;
                if (isset($review['user']) && isset($review['user']['id'])) {
                    $reviewer = $this->githubUserService->findOrCreate($review['user']);
                }

                $allReviews[] = [
                    'github_id' => $review['id'],
                    'pull_request_id' => $pr->id,
                    'reviewer_id' => $reviewer?->id,
                    'state' => strtolower($review['state']),
                    'body' => $review['body'] ?? null,
                    'submitted_at' => $review['submitted_at'] ?? null,
                    'commit_id' => $review['commit_id'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (empty($allReviews)) {
            return response()->json([
                'success' => true,
                'message' => 'No hay revisiones para sincronizar',
            ]);
        }

        DB::table('pull_request_reviews')->upsert(
            $allReviews,
            ['github_id'],
            ['state', 'body', 'submitted_at', 'commit_id', 'updated_at']
        );

        return response()->json([
            'success' => true,
            'message' => count($allReviews).' revisiones sincronizadas',
            'count' => count($allReviews),
        ]);
    }

    /**
     * Returns a paginated list
     *
     * @return LengthAwarePaginator<int, PullRequestReview>
     */
    public function index(?Request $request = null): LengthAwarePaginator
    {
        $query = PullRequestReview::query()->with(['pullRequest', 'reviewer']);

        if ($request?->filled('search')) {
            $search = '%'.$request->search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('body', 'ilike', $search)
                    ->orWhereHas('reviewer', function ($r) use ($search) {
                        $r->where('name', 'ilike', $search);
                    })
                    ->orWhereHas('pullRequest', function ($p) use ($search) {
                        $p->where('title', 'ilike', $search);
                    });
            });
        }

        if ($request?->filled('state') && $request->state !== 'all') {
            $query->where('state', $request->state);
        }

        if ($request?->filled('reviewer_id') && $request->reviewer_id !== 'all') {
            $query->where('reviewer_id', $request->reviewer_id);
        }

        return $query->latest()->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created item.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): PullRequestReview
    {
        return PullRequestReview::create($data);
    }

    /**
     * Display the specified item.
     *
     * @param  int  $id
     * @return PullRequestReview
     */
    public function show($id)
    {
        $item = PullRequestReview::findOrFail($id);

        return $item;
    }

    /**
     * Update the specified item in storage.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): bool
    {
        return PullRequestReview::findOrFail($id)->update($data);
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return PullRequestReview::destroy($id) > 0;
    }
}
