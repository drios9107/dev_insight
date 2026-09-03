<?php

namespace App\Services;

use App\Models\GithubRepository;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use Illuminate\Support\Facades\DB;

class PullRequestReviewService
{
    public function fetchData(GithubService $service, string $ownerKey = 'drios9107', string $repoName = 'expenses')
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
                $allReviews[] = [
                    'github_id' => $review['id'],
                    'pull_request_id' => $pr->id,
                    'reviewer_id' => null,
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

    public function index()
    {
        return PullRequestReview::all();
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(array $data): bool
    {
        return PullRequestReview::create($data) !== null;
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
     */
    public function update(int $id, array $data): bool
    {
        return PullRequestReview::whereId($id)->update($data) !== null;
    }

    /**
     * Remove the specified item from storage.
     *
     * @param  int  $id
     * @return bool
     */
    public function destroy($id)
    {
        return PullRequestReview::destroy($id) !== null;
    }
}
