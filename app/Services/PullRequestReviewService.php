<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PullRequestReviewService extends BaseGithubService
{
    private GithubUserService $githubUserService;

    public function __construct(
        GithubService $github,
        GithubUserService $githubUserService,
    ) {
        parent::__construct($github);
        $this->githubUserService = $githubUserService;
    }

    /**
     * Fetch pull request reviews from GitHub and upsert them into the database.
     *
     * @return array{success: bool, message: string, count?: int}
     *
     * @throws \Exception
     */
    public function fetchData(string $ownerKey, string $repoName): array
    {
        $repo = $this->github->getRepository($ownerKey, $repoName);

        $repoId = GithubRepository::whereGithubId($repo['id'])->value('id');

        if ($repoId === null) {
            return [
                'success' => false,
                'message' => 'Repository not found in database',
            ];
        }

        $prs = PullRequest::whereGithubRepositoryId($repoId)->get();

        if ($prs->isEmpty()) {
            return [
                'success' => false,
                'message' => 'No pull requests found in the system',
            ];
        }

        /** @var array<int, array<string, mixed>> $allReviews */
        $allReviews = [];

        foreach ($prs as $pr) {
            $reviews = $this->github->getPullRequestReviews($ownerKey, $repoName, $pr->number);

            foreach ($reviews as $review) {
                $reviewer = null;

                if (isset($review['user']['id'])) {
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
            return [
                'success' => true,
                'message' => 'No reviews to sync',
                'count' => 0,
            ];
        }

        DB::table('pull_request_reviews')->upsert(
            $allReviews,
            ['github_id'],
            ['state', 'body', 'submitted_at', 'commit_id', 'updated_at'],
        );

        return [
            'success' => true,
            'message' => count($allReviews).' reviews synced',
            'count' => count($allReviews),
        ];
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

    /**
     * @param  array<int, int|string>  $ids
     */
    public function bulkDestroy(array $ids): int
    {
        $items = PullRequestReview::whereIn('id', $ids)->get();

        $count = 0;

        foreach ($items as $i) {
            $i->delete();
            $count++;
        }

        return $count;
    }
}
