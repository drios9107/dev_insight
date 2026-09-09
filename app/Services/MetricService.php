<?php

namespace App\Services;

use App\Models\Commit;
use App\Models\GithubIssue;
use App\Models\GithubUser;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MetricService
{
    public function getDashboardMetrics(?int $repositoryId = null)
    {
        return [
            // =============================================
            // CARDS (Resumen)
            // =============================================
            'cards' => $this->getCards($repositoryId),

            // =============================================
            // GRÁFICOS
            // =============================================
            'commits_by_day' => $this->getCommitsByDay($repositoryId, 30),
            'commits_by_week' => $this->getCommitsByWeek($repositoryId, 12),
            'prs_by_state' => $this->getPrsByState($repositoryId),
            'issues_by_state' => $this->getIssuesByState($repositoryId),
            'reviews_by_state' => $this->getReviewsByState($repositoryId),

            // =============================================
            // TABLAS
            // =============================================
            'top_developers' => $this->getTopDevelopers($repositoryId, 10),
            'top_reviewers' => $this->getTopReviewers($repositoryId, 10),
            'recent_activity' => $this->getRecentActivity($repositoryId, 10),

            // =============================================
            // ESTADÍSTICAS AVANZADAS
            // =============================================
            'avg_commits_per_day' => $this->getAvgCommitsPerDay($repositoryId),
            'avg_pr_merge_time' => $this->getAvgPrMergeTime($repositoryId),
            'avg_issue_close_time' => $this->getAvgIssueCloseTime($repositoryId),
            'active_developers' => $this->getActiveDevelopers($repositoryId, 30),
            'code_churn' => $this->getCodeChurn($repositoryId, 30),

            'developer_stats' => $this->getDeveloperStats($repositoryId),
            'developer_activity_heatmap' => $this->getDeveloperActivityHeatmap($repositoryId, 7),
            'code_quality' => $this->getCodeQualityMetrics($repositoryId),
            'pr_cycle_time' => $this->getPrCycleTime($repositoryId),
            'developer_ranking' => $this->getDeveloperRanking($repositoryId),
        ];
    }

    // =============================================
    // CARDS
    // =============================================

    private function getCards(?int $repositoryId): array
    {
        $query = Commit::query();
        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $totalCommits = $query->count();

        $totalPrs = PullRequest::query()
            ->when($repositoryId, fn ($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $openPrs = PullRequest::query()
            ->where('state', 'open')
            ->when($repositoryId, fn ($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $totalIssues = GithubIssue::query()
            ->when($repositoryId, fn ($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $openIssues = GithubIssue::query()
            ->where('state', 'open')
            ->when($repositoryId, fn ($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $totalReviews = PullRequestReview::query()
            ->when($repositoryId, fn ($q) => $q->whereHas('pullRequest', fn ($p) => $p->where('github_repository_id', $repositoryId)))
            ->count();

        $avgReviewTime = $this->getAvgPrMergeTime($repositoryId);

        return [
            [
                'label' => 'Total Commits',
                'value' => $totalCommits,
                'icon' => 'GitCommit',
                'color' => 'blue',
            ],
            [
                'label' => 'Pull Requests',
                'value' => $totalPrs,
                'sub' => "{$openPrs} open",
                'icon' => 'GitPullRequest',
                'color' => 'purple',
            ],
            [
                'label' => 'Issues',
                'value' => $totalIssues,
                'sub' => "{$openIssues} open",
                'icon' => 'Bug',
                'color' => 'red',
            ],
            [
                'label' => 'Reviews',
                'value' => $totalReviews,
                'sub' => "Avg {$avgReviewTime}h",
                'icon' => 'CheckSquare',
                'color' => 'green',
            ],
        ];
    }

    // =============================================
    // GRÁFICOS - COMMITS POR DÍA
    // =============================================

    private function getCommitsByDay(?int $repositoryId, int $days): array
    {
        $query = Commit::select(
            DB::raw('DATE(date) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('date', '>=', now()->subDays($days))
            ->groupBy(DB::raw('DATE(date)'))
            ->orderBy('date');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $results = $query->get();

        return $results->filter(fn ($item) => $item->count > 0)
            ->map(fn ($item) => [
                'date' => $item->date,
                'count' => $item->count,
            ])
            ->values()
            ->toArray();
    }

    // =============================================
    // GRÁFICOS - COMMITS POR SEMANA
    // =============================================

    private function getCommitsByWeek(?int $repositoryId, int $weeks): array
    {
        $query = Commit::select(
            DB::raw('DATE_TRUNC(\'week\', date) as week'),
            DB::raw('COUNT(*) as count')
        )
            ->where('date', '>=', now()->subWeeks($weeks))
            ->groupBy('week')
            ->orderBy('week');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->get()
            ->map(fn ($item) => [
                'week' => Carbon::parse($item->week)->format('Y-m-d'),
                'count' => $item->count,
            ])
            ->toArray();
    }

    // =============================================
    // GRÁFICOS - PRS POR ESTADO
    // =============================================

    private function getPrsByState(?int $repositoryId): array
    {
        $query = PullRequest::select(
            'state',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('state');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->pluck('count', 'state')->toArray();
    }

    // =============================================
    // GRÁFICOS - ISSUES POR ESTADO
    // =============================================

    private function getIssuesByState(?int $repositoryId): array
    {
        $query = GithubIssue::select(
            'state',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('state');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->pluck('count', 'state')->toArray();
    }

    // =============================================
    // GRÁFICOS - REVIEWS POR ESTADO
    // =============================================

    private function getReviewsByState(?int $repositoryId): array
    {
        $query = PullRequestReview::select(
            'state',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('state');

        if ($repositoryId) {
            $query->whereHas('pullRequest', fn ($p) => $p->where('github_repository_id', $repositoryId));
        }

        return $query->pluck('count', 'state')->toArray();
    }

    // =============================================
    // TABLAS - TOP DESARROLLADORES
    // =============================================

    private function getTopDevelopers(?int $repositoryId, int $limit): array
    {
        $query = Commit::select(
            'author_id',
            DB::raw('COUNT(*) as total_commits'),
            DB::raw('COUNT(DISTINCT DATE(date)) as active_days')
        )
            ->with('author')
            ->groupBy('author_id')
            ->orderByDesc('total_commits')
            ->limit($limit);

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->get()
            ->map(fn ($item) => [
                'name' => $item->author?->displayName ?? 'Unknown',
                'username' => $item->author?->username ?? 'unknown',
                'avatar' => $item->author?->avatar ?? null,
                'commits' => $item->total_commits,
                'active_days' => $item->active_days,
                'prs' => PullRequest::where('author_id', $item->author_id)->count(),
            ])
            ->toArray();
    }

    // =============================================
    // TABLAS - TOP REVISORES
    // =============================================

    private function getTopReviewers(?int $repositoryId, int $limit): array
    {
        $query = PullRequestReview::select(
            'reviewer_id',
            DB::raw('COUNT(*) as total_reviews'),
            DB::raw('COUNT(CASE WHEN state = \'approved\' THEN 1 END) as approved'),
            DB::raw('COUNT(CASE WHEN state = \'changes_requested\' THEN 1 END) as changes_requested')
        )
            ->with('reviewer')
            ->groupBy('reviewer_id')
            ->orderByDesc('total_reviews')
            ->limit($limit);

        if ($repositoryId) {
            $query->whereHas('pullRequest', fn ($p) => $p->where('github_repository_id', $repositoryId));
        }

        return $query->get()
            ->map(fn ($item) => [
                'name' => $item->reviewer?->displayName ?? 'Unknown',
                'username' => $item->reviewer?->username ?? 'unknown',
                'avatar' => $item->reviewer?->avatar ?? null,
                'total_reviews' => $item->total_reviews,
                'approved' => $item->approved,
                'changes_requested' => $item->changes_requested,
                'approval_rate' => $item->total_reviews > 0
                    ? round(($item->approved / $item->total_reviews) * 100, 1)
                    : 0,
            ])
            ->toArray();
    }

    // =============================================
    // TABLAS - ACTIVIDAD RECIENTE
    // =============================================

    private function getRecentActivity(?int $repositoryId, int $limit): array
    {
        $activities = [];

        // Últimos commits
        $commits = Commit::with(['author', 'githubRepository'])
            ->when($repositoryId, fn ($q) => $q->where('github_repository_id', $repositoryId))
            ->latest('date')
            ->limit($limit / 2)
            ->get()
            ->map(fn ($item) => [
                'type' => 'commit',
                'message' => $item->message,
                'author' => $item->author?->displayName ?? 'Unknown',
                'repository' => $item->githubRepository?->full_name ?? '',
                // @todo: fix diffForHumans()
                // 'date' => $item->date?$item->date?->diffForHumans() : '',
                'date' => $item->date ?? '',
                'url' => $item->url,
            ]);

        // Últimos PRs
        $prs = PullRequest::with(['author', 'githubRepository'])
            ->when($repositoryId, fn ($q) => $q->where('github_repository_id', $repositoryId))
            ->latest('created_at')
            ->limit($limit / 2)
            ->get()
            ->map(fn ($item) => [
                'type' => 'pull_request',
                'message' => $item->title,
                'author' => $item->author?->displayName ?? 'Unknown',
                'repository' => $item->githubRepository?->full_name ?? '',
                'date' => $item->created_at?->diffForHumans() ?? '',
                'url' => $item->html_url ?? '',
            ]);

        $activities = array_merge($commits->toArray(), $prs->toArray());

        // Ordenar por fecha y limitar
        usort($activities, fn ($a, $b) => strtotime($b['date']) <=> strtotime($a['date']));

        return array_slice($activities, 0, $limit);
    }

    // =============================================
    // ESTADÍSTICAS AVANZADAS
    // =============================================

    private function getAvgCommitsPerDay(?int $repositoryId): float
    {
        $query = Commit::query()
            ->where('date', '>=', now()->subDays(30));

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $total = $query->count();

        return $total > 0 ? round($total / 30, 1) : 0;
    }

    private function getAvgPrMergeTime(?int $repositoryId): float
    {
        $query = PullRequest::whereNotNull('merged_at')
            ->where('state', 'merged');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $avg = $query->select(
            DB::raw('AVG(EXTRACT(EPOCH FROM (merged_at - created_at)) / 3600) as avg_hours')
        )->value('avg_hours');

        return $avg ? round($avg, 1) : 0;
    }

    private function getAvgIssueCloseTime(?int $repositoryId): float
    {
        $query = GithubIssue::whereNotNull('closed_at')
            ->where('state', 'closed');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $avg = $query->select(
            DB::raw('AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400) as avg_days')
        )->value('avg_days');

        return $avg ? round($avg, 1) : 0;
    }

    private function getActiveDevelopers(?int $repositoryId, int $days): int
    {
        $query = Commit::select('author_id')
            ->where('date', '>=', now()->subDays($days))
            ->distinct();

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->count();
    }

    private function getCodeChurn(?int $repositoryId, int $days): array
    {
        $query = Commit::select(
            DB::raw('SUM(additions) as total_additions'),
            DB::raw('SUM(deletions) as total_deletions')
        )
            ->where('date', '>=', now()->subDays($days));

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $result = $query->first();

        return [
            'additions' => $result->total_additions ?? 0,
            'deletions' => $result->total_deletions ?? 0,
            'total' => ($result->total_additions ?? 0) + ($result->total_deletions ?? 0),
        ];
    }

    // ✅ getDeveloperStats devuelve Collection
    private function getDeveloperStats(?int $repositoryId): Collection
    {
        $query = Commit::query()
            ->select(
                'author_id',
                DB::raw('COUNT(*) as total_commits'),
                DB::raw('COUNT(DISTINCT DATE(date)) as active_days'),
                DB::raw('SUM(additions) as total_additions'),
                DB::raw('SUM(deletions) as total_deletions'),
                DB::raw('AVG(additions + deletions) as avg_commit_size')
            )
            ->with('author')
            ->groupBy('author_id')
            ->orderByDesc('total_commits');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $developers = $query->get();

        // PRs por desarrollador
        $prCounts = PullRequest::select('author_id', DB::raw('COUNT(*) as pr_count'))
            ->groupBy('author_id')
            ->pluck('pr_count', 'author_id');

        // Reviews por desarrollador
        $reviewCounts = PullRequestReview::select('reviewer_id', DB::raw('COUNT(*) as review_count'))
            ->groupBy('reviewer_id')
            ->pluck('review_count', 'reviewer_id');

        return $developers->map(function ($dev) use ($prCounts, $reviewCounts) {
            $commits = $dev->total_commits;
            $prs = $prCounts[$dev->author_id] ?? 0;
            $reviews = $reviewCounts[$dev->author_id] ?? 0;

            return [
                'name' => $dev->author?->displayName ?? 'Unknown',
                'username' => $dev->author?->username ?? 'unknown',
                'avatar' => $dev->author?->avatar ?? null,
                'commits' => $commits,
                'prs' => $prs,
                'reviews' => $reviews,
                'active_days' => $dev->active_days,
                'productivity_score' => round(
                    ($commits * 0.4) + ($prs * 0.35) + ($reviews * 0.25),
                    1
                ),
                'avg_commit_size' => round($dev->avg_commit_size ?? 0, 1),
                'additions' => $dev->total_additions ?? 0,
                'deletions' => $dev->total_deletions ?? 0,
                'net_change' => ($dev->total_additions ?? 0) - ($dev->total_deletions ?? 0),
            ];
        });
    }

    private function getDeveloperRanking(?int $repositoryId): array
    {
        $stats = $this->getDeveloperStats($repositoryId);

        return [
            'most_commits' => $stats->sortByDesc('commits')->first(),
            'most_prs' => $stats->sortByDesc('prs')->first(),
            'most_reviews' => $stats->sortByDesc('reviews')->first(),
            'highest_productivity' => $stats->sortByDesc('productivity_score')->first(),
        ];
    }

    private function getDeveloperActivityHeatmap(?int $repositoryId, int $days): array
    {
        $query = Commit::select(
            DB::raw('author_id'),
            DB::raw('DATE(date) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('date', '>=', now()->subDays($days))
            ->groupBy('author_id', 'date')
            ->orderBy('date');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $results = $query->get();

        // Obtener todos los desarrolladores
        $developers = GithubUser::whereIn('id', $results->pluck('author_id')->unique())
            ->get()
            ->keyBy('id');

        $dates = collect();
        for ($i = $days - 1; $i >= 0; $i--) {
            $dates->push(now()->subDays($i)->format('Y-m-d'));
        }

        return $results->groupBy('author_id')->map(function ($items, $authorId) use ($dates, $developers) {
            $developer = $developers[$authorId] ?? null;
            $activity = $dates->map(function ($date) use ($items) {
                $item = $items->firstWhere('date', $date);

                return [
                    'date' => $date,
                    'count' => $item?->count ?? 0,
                ];
            });

            return [
                'name' => $developer?->displayName ?? 'Unknown',
                'username' => $developer?->username ?? 'unknown',
                'avatar' => $developer?->avatar ?? null,
                'activity' => $activity->toArray(),
                'total' => $items->sum('count'),
            ];
        })->sortByDesc('total')->values()->toArray();
    }

    private function getCodeQualityMetrics(?int $repositoryId): array
    {
        // PR aprobados vs cambios solicitados
        $prQuery = PullRequest::query();
        if ($repositoryId) {
            $prQuery->where('github_repository_id', $repositoryId);
        }

        $reviewQuery = PullRequestReview::query();
        if ($repositoryId) {
            $reviewQuery->whereHas('pullRequest', fn ($p) => $p->where('github_repository_id', $repositoryId));
        }

        $totalReviews = $reviewQuery->count();
        $approved = $reviewQuery->where('state', 'approved')->count();
        $changesRequested = $reviewQuery->where('state', 'changes_requested')->count();

        $totalPrs = $prQuery->count();
        $mergedPrs = $prQuery->where('state', 'merged')->count();

        return [
            'approval_rate' => $totalReviews > 0 ? round(($approved / $totalReviews) * 100, 1) : 0,
            'changes_requested_rate' => $totalReviews > 0 ? round(($changesRequested / $totalReviews) * 100, 1) : 0,
            'merge_rate' => $totalPrs > 0 ? round(($mergedPrs / $totalPrs) * 100, 1) : 0,
            'avg_reviews_per_pr' => $totalPrs > 0 ? round($totalReviews / $totalPrs, 1) : 0,
        ];
    }

    private function getPrCycleTime(?int $repositoryId): array
    {
        $query = PullRequest::whereNotNull('merged_at')
            ->where('state', 'merged');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $prs = $query->select(
            DB::raw('EXTRACT(EPOCH FROM (merged_at - created_at)) / 3600 as hours')
        )->get();

        if ($prs->isEmpty()) {
            return ['avg' => 0, 'min' => 0, 'max' => 0, 'median' => 0];
        }

        $times = $prs->pluck('hours')->sort()->values();

        return [
            'avg' => round($times->average(), 1),
            'min' => round($times->first(), 1),
            'max' => round($times->last(), 1),
            'median' => round($times->median(), 1),
            'p25' => round($times->percentile(25), 1),
            'p75' => round($times->percentile(75), 1),
        ];
    }
}
