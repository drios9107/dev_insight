<?php

namespace App\Services;

use App\Models\Commit;
use App\Models\GithubIssue;
use App\Models\GithubUser;
use App\Models\Project;
use App\Models\PullRequest;
use App\Models\PullRequestReview;
use App\Models\Sprint;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MetricService
{
    public function getDashboardMetrics(?int $repositoryId = null)
    {
        return [
            // =============================================
            // CARDS
            // =============================================
            'cards' => $this->getCards($repositoryId),

            // =============================================
            // CHARTS
            // =============================================
            'commits_by_day' => $this->getCommitsByDay($repositoryId, 30),
            'days_without_commit' => $this->getDaysWithoutCommit($repositoryId, 10),
            'commits_by_week' => $this->getCommitsByWeek($repositoryId, 12),
            'prs_by_state' => $this->getPrsByState($repositoryId),
            'issues_by_state' => $this->getIssuesByState($repositoryId),
            'reviews_by_state' => $this->getReviewsByState($repositoryId),

            // =============================================
            // TABLES
            // =============================================
            'top_developers' => $this->getTopDevelopers($repositoryId, 10),
            'top_reviewers' => $this->getTopReviewers($repositoryId, 10),
            'recent_activity' => $this->getRecentActivity($repositoryId, 10),

            // =============================================
            // ADVANCED STATS
            // =============================================
            'avg_commits_per_day' => $this->getAvgCommitsPerDay($repositoryId),
            'avg_pr_merge_time' => $this->getAvgPrMergeTime($repositoryId),
            'avg_issue_close_time' => $this->getAvgIssueCloseTime($repositoryId),
            'active_developers' => $this->getActiveDevelopers($repositoryId, 30),

            'developer_stats' => $this->getDeveloperStats($repositoryId),
            'developer_activity_heatmap' => $this->getDeveloperActivityHeatmap($repositoryId, 7),
            'code_quality' => $this->getCodeQualityMetrics($repositoryId),
            'pr_cycle_time' => $this->getPrCycleTime($repositoryId),
            'developer_ranking' => $this->getDeveloperRanking($repositoryId),

            // 👥 Team Members
            'team_members' => $this->getTeamMembers($repositoryId),

            // ⚡ Action Cards
            'stale_prs' => $this->getStalePrs($repositoryId),
            'prs_needing_review' => $this->getPrsNeedingReview($repositoryId),
            'inactive_developers' => $this->getInactiveDevelopers($repositoryId, 7),
            'pr_merge_rate' => $this->getPrMergeRate($repositoryId),
            'prs_merged' => $this->getPrsMerged($repositoryId),
            'prs_total' => $this->getPrsTotal($repositoryId),

            // 🏆 Rankings
            'top_contributors' => $this->getTopContributors($repositoryId, 5),
            'top_committers' => $this->getTopCommitters($repositoryId, 5),

            // Projects
            'active_projects' => $this->getProjectMetrics()['active_projects'],
            'total_projects' => $this->getProjectMetrics()['total_projects'],

            // Sprints
            'active_sprints' => $this->getSprintMetrics()['active_sprints'],
            'total_sprints' => $this->getSprintMetrics()['total_sprints'],
            'sprint_completion_rate' => $this->getSprintMetrics()['sprint_completion_rate'],

            // Issues
            'open_issues' => $this->getIssueMetrics()['open_issues'],
            'total_issues' => $this->getIssueMetrics()['total_issues'],
            'avg_issue_resolution_time' => $this->getIssueMetrics()['avg_issue_resolution_time'],

            // Tasks
            'tasks_in_progress' => $this->getTaskMetrics()['tasks_in_progress'],
            'tasks_in_review' => $this->getTaskMetrics()['tasks_in_review'],
            'total_tasks' => $this->getTaskMetrics()['total_tasks'],
            'task_completion_rate' => $this->getTaskMetrics()['task_completion_rate'],
            'overdue_tasks' => $this->getTaskMetrics()['overdue_tasks'],
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
            ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $openPrs = PullRequest::query()
            ->where('state', 'open')
            ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $totalIssues = GithubIssue::query()
            ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $openIssues = GithubIssue::query()
            ->where('state', 'open')
            ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
            ->count();

        $totalReviews = PullRequestReview::query()
            ->when($repositoryId, fn($q) => $q->whereHas('pullRequest', fn($p) => $p->where('github_repository_id', $repositoryId)))
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
    // CHARTS
    // =============================================

    private function getDaysWithoutCommit(?int $repositoryId, int $limit = 10): array
    {
        $thirtyDaysAgo = now()->subDays(30);

        $query = GithubUser::query()
            ->whereHas('commits', function ($q) use ($repositoryId, $thirtyDaysAgo) {
                $q->where('date', '>=', $thirtyDaysAgo);
                if ($repositoryId) {
                    $q->where('github_repository_id', $repositoryId);
                }
            });

        $users = $query->get();

        $data = $users->map(function ($user) use ($repositoryId, $thirtyDaysAgo) {
            $lastCommit = Commit::where('author_id', $user->id)
                ->where('date', '>=', $thirtyDaysAgo)
                ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
                ->latest('date')
                ->first();

            $daysWithoutCommit = $lastCommit
                ? (int) Carbon::parse($lastCommit->date)->diffInDays(now())
                : 999;

            return [
                'name' => $user->displayName,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'days_without_commit' => $daysWithoutCommit,
                'last_commit_date' => $lastCommit ? $lastCommit->date : null,
            ];
        })
            ->sortByDesc('days_without_commit')
            ->take($limit)
            ->values()
            ->toArray();

        return $data;
    }

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

        return $results->filter(fn($item) => $item->count > 0)
            ->map(fn($item) => [
                'date' => $item->date,
                'count' => $item->count,
            ])
            ->values()
            ->toArray();
    }

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
            ->map(fn($item) => [
                'week' => Carbon::parse($item->week)->format('Y-m-d'),
                'count' => $item->count,
            ])
            ->toArray();
    }

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

    private function getReviewsByState(?int $repositoryId): array
    {
        $query = PullRequestReview::select(
            'state',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('state');

        if ($repositoryId) {
            $query->whereHas('pullRequest', fn($p) => $p->where('github_repository_id', $repositoryId));
        }

        return $query->pluck('count', 'state')->toArray();
    }

    // =============================================
    // TABLES
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
            ->map(fn($item) => [
                'name' => $item->author?->displayName ?? 'Unknown',
                'username' => $item->author?->username ?? 'unknown',
                'avatar' => $item->author?->avatar ?? null,
                'commits' => $item->total_commits,
                'active_days' => $item->active_days,
                'prs' => PullRequest::where('author_id', $item->author_id)->count(),
            ])
            ->toArray();
    }

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
            $query->whereHas('pullRequest', fn($p) => $p->where('github_repository_id', $repositoryId));
        }

        return $query->get()
            ->map(fn($item) => [
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

    private function getRecentActivity(?int $repositoryId, int $limit): array
    {
        $activities = [];

        $commits = Commit::with(['author', 'githubRepository'])
            ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
            ->latest('date')
            ->limit($limit / 2)
            ->get()
            ->map(fn($item) => [
                'type' => 'commit',
                'message' => $item->message,
                'author' => $item->author?->displayName ?? 'Unknown',
                'repository' => $item->githubRepository?->full_name ?? '',
                'date' => $item->date ? Carbon::parse($item->date)->diffForHumans() : 'Never',
                'url' => $item->url,
            ]);

        $prs = PullRequest::with(['author', 'githubRepository'])
            ->when($repositoryId, fn($q) => $q->where('github_repository_id', $repositoryId))
            ->latest('created_at')
            ->limit($limit / 2)
            ->get()
            ->map(fn($item) => [
                'type' => 'pull_request',
                'message' => $item->title,
                'author' => $item->author?->displayName ?? 'Unknown',
                'repository' => $item->githubRepository?->full_name ?? '',
                'date' => $item->created_at?->diffForHumans() ?? '',
                'url' => $item->html_url ?? '',
            ]);

        $activities = array_merge($commits->toArray(), $prs->toArray());

        usort($activities, fn($a, $b) => strtotime($b['date']) <=> strtotime($a['date']));

        return array_slice($activities, 0, $limit);
    }

    // =============================================
    // ADVANCED STATS
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
        $query = Commit::where('date', '>=', now()->subDays($days))
            ->whereNotNull('author_id')
            ->pluck('author_id')
            ->unique()
            ->count();

        if ($repositoryId) {
            $query = Commit::where('date', '>=', now()->subDays($days))
                ->where('github_repository_id', $repositoryId)
                ->whereNotNull('author_id')
                ->pluck('author_id')
                ->unique()
                ->count();
        }

        return $query;
    }

    // =============================================
    // DEVELOPER STATS
    // =============================================

    private function getDeveloperStats(?int $repositoryId): Collection
    {
        $query = Commit::query()
            ->select(
                'author_id',
                DB::raw('COUNT(*) as total_commits'),
                DB::raw('COUNT(DISTINCT DATE(date)) as active_days')
            )
            ->with('author')
            ->groupBy('author_id')
            ->orderByDesc('total_commits');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        $developers = $query->get();

        $prCounts = PullRequest::select('author_id', DB::raw('COUNT(*) as pr_count'))
            ->groupBy('author_id')
            ->pluck('pr_count', 'author_id');

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
                // Custom score: 40% commits, 35% PRs, 25% reviews (adjustable)
                'productivity_score' => round(
                    ($commits * 0.4) + ($prs * 0.35) + ($reviews * 0.25),
                    1
                ),
                'avg_commit_size' => round($dev->avg_commit_size ?? 0, 1),
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
        $prQuery = PullRequest::query();
        if ($repositoryId) {
            $prQuery->where('github_repository_id', $repositoryId);
        }

        $reviewQuery = PullRequestReview::query();
        if ($repositoryId) {
            $reviewQuery->whereHas('pullRequest', fn($p) => $p->where('github_repository_id', $repositoryId));
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
            DB::raw('EXTRACT(EPOCH FROM (merged_at - created_at)) / 60 as minutes')
        )->get();

        if ($prs->isEmpty()) {
            return ['avg' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'p25' => 0, 'p75' => 0];
        }

        $times = $prs->pluck('minutes')->sort()->values();

        return [
            'avg' => round($times->average(), 2),
            'min' => round($times->first(), 2),
            'max' => round($times->last(), 2),
            'median' => round($this->calculatePercentile($times, 50), 2),
            'p25' => round($this->calculatePercentile($times, 25), 2),
            'p75' => round($this->calculatePercentile($times, 75), 2),
        ];
    }

    private function calculatePercentile($collection, float $percentile): float
    {
        $index = ($percentile / 100) * ($collection->count() - 1);
        $lower = floor($index);
        $upper = ceil($index);

        if ($lower === $upper) {
            return (float) $collection[$lower];
        }

        $weight = $index - $lower;

        return (float) ($collection[$lower] * (1 - $weight) + $collection[$upper] * $weight);
    }

    // 👥 TEAM MEMBERS
    private function getTeamMembers(?int $repositoryId): array
    {
        // Active developers
        $query = GithubUser::query()
            ->withCount([
                'commits' => fn($q) => $q->when($repositoryId, fn($q2) => $q2->where('github_repository_id', $repositoryId)),
                'authoredPullRequests' => fn($q) => $q->when($repositoryId, fn($q2) => $q2->where('github_repository_id', $repositoryId)),
                'pullRequestReviews' => fn($q) => $q->when($repositoryId, fn($q2) => $q2->whereHas('pullRequest', fn($p) => $p->where('github_repository_id', $repositoryId))),
            ]);

        if ($repositoryId) {
            $query->whereHas('commits', fn($q) => $q->where('github_repository_id', $repositoryId));
        }

        $users = $query->get();

        return $users->map(function ($user) {
            $lastCommit = Commit::where('author_id', $user->id)
                ->when(request()->get('repository_id'), fn($q) => $q->where('github_repository_id', request()->get('repository_id')))
                ->latest('date')
                ->first();

            $daysSinceLastCommit = $lastCommit ? now()->diffInDays($lastCommit->date) : 999;

            $status = 'active';
            if ($daysSinceLastCommit > 7) {
                $status = 'away';
            } elseif ($daysSinceLastCommit > 3) {
                $status = 'idle';
            }

            return [
                'name' => $user->displayName,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'commits' => $user->commits_count,
                'prs' => $user->authored_pull_requests_count,
                'reviews' => $user->pull_request_reviews_count,
                'last_active' => $lastCommit ? Carbon::parse($lastCommit->date)->diffForHumans() : 'Never',
                'status' => $status,
            ];
        })->toArray();
    }

    // ⚡ STALE PRS
    private function getStalePrs(?int $repositoryId): int
    {
        $query = PullRequest::where('state', 'open')
            ->where('updated_at', '<', now()->subDays(7));

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->count();
    }

    // PRS NEEDING REVIEW
    private function getPrsNeedingReview(?int $repositoryId): int
    {
        $query = PullRequest::where('state', 'open')
            ->whereDoesntHave('reviews');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->count();
    }

    // INACTIVE DEVELOPERS
    private function getInactiveDevelopers(?int $repositoryId, int $days): int
    {
        $query = GithubUser::whereDoesntHave('commits', function ($q) use ($repositoryId, $days) {
            $q->where('date', '>=', now()->subDays($days));
            if ($repositoryId) {
                $q->where('github_repository_id', $repositoryId);
            }
        });

        if ($repositoryId) {
            $query->whereHas('commits', fn($q) => $q->where('github_repository_id', $repositoryId));
        }

        return $query->count();
    }

    // PR MERGE RATE
    private function getPrMergeRate(?int $repositoryId): float
    {
        $total = $this->getPrsTotal($repositoryId);
        $merged = $this->getPrsMerged($repositoryId);

        return $total > 0 ? round(($merged / $total) * 100, 1) : 0;
    }

    private function getPrsMerged(?int $repositoryId): int
    {
        $query = PullRequest::where('state', 'merged');

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->count();
    }

    private function getPrsTotal(?int $repositoryId): int
    {
        $query = PullRequest::query();

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->count();
    }

    // 🏆 TOP CONTRIBUTORS
    private function getTopContributors(?int $repositoryId, int $limit): array
    {
        $stats = $this->getDeveloperStats($repositoryId);

        return $stats->sortByDesc(function ($item) {
            return ($item['commits'] * 0.4) + ($item['prs'] * 0.35) + ($item['reviews'] * 0.25);
        })
            ->take($limit)
            ->map(function ($item) {
                return [
                    'name' => $item['name'],
                    'username' => $item['username'],
                    'avatar' => $item['avatar'],
                    'score' => $item['productivity_score'],
                    'commits' => $item['commits'],
                    'prs' => $item['prs'],
                    'reviews' => $item['reviews'],
                ];
            })
            ->values()
            ->toArray();
    }

    // TOP COMMITTERS
    private function getTopCommitters(?int $repositoryId, int $limit): array
    {
        $query = Commit::select(
            'author_id',
            DB::raw('COUNT(*) as total_commits')
        )
            ->with('author')
            ->groupBy('author_id')
            ->orderByDesc('total_commits')
            ->limit($limit);

        if ($repositoryId) {
            $query->where('github_repository_id', $repositoryId);
        }

        return $query->get()
            ->map(fn($item) => [
                'name' => $item->author?->displayName ?? 'Unknown',
                'username' => $item->author?->username ?? 'unknown',
                'avatar' => $item->author?->avatar ?? null,
                'commits' => $item->total_commits,
            ])
            ->toArray();
    }

    // =============================================
    // PROJECTS
    // =============================================

    private function getProjectMetrics(): array
    {
        return [
            'active_projects' => Project::where('status', 'active')->count(),
            'total_projects' => Project::count(),
        ];
    }

    // =============================================
    // SPRINTS
    // =============================================

    private function getSprintMetrics(): array
    {
        return [
            'active_sprints' => Sprint::where('status', 'active')->count(),
            'total_sprints' => Sprint::count(),
            'sprint_completion_rate' => $this->getSprintCompletionRate(),
        ];
    }

    private function getSprintCompletionRate(): float
    {
        $total = Sprint::count();
        if ($total === 0) {
            return 0;
        }

        $completed = Sprint::where('status', 'completed')->count();

        return round(($completed / $total) * 100, 1);
    }

    // =============================================
    // ISSUES
    // =============================================

    private function getIssueMetrics(): array
    {
        return [
            'open_issues' => GithubIssue::where('state', 'open')->count(),
            'total_issues' => GithubIssue::count(),
            'avg_issue_resolution_time' => $this->getAvgIssueResolutionTime(),
        ];
    }

    private function getAvgIssueResolutionTime(): float
    {
        $avg = GithubIssue::whereNotNull('closed_at')
            ->where('state', 'closed')
            ->select(DB::raw('AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400) as days'))
            ->value('days');

        return $avg ? round($avg, 1) : 0;
    }

    // =============================================
    // TASKS
    // =============================================

    private function getTaskMetrics(): array
    {
        return [
            'tasks_in_progress' => Task::where('status', 'in_progress')->count(),
            'tasks_in_review' => Task::where('status', 'review')->count(),
            'total_tasks' => Task::count(),
            'task_completion_rate' => $this->getTaskCompletionRate(),
            'overdue_tasks' => $this->getOverdueTasks(),
        ];
    }

    private function getTaskCompletionRate(): float
    {
        $total = Task::count();
        if ($total === 0) {
            return 0;
        }

        $completed = Task::where('status', 'done')->count();

        return round(($completed / $total) * 100, 1);
    }

    private function getOverdueTasks(): int
    {
        return Task::where('due_date', '<', now())
            ->whereNotIn('status', ['done', 'cancelled'])
            ->count();
    }
}
