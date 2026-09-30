// types/metrics.ts

// =============================================
// SHARED TYPES
// =============================================

export interface IMetricCard {
    label: string;
    value: number;
    sub?: string;
    icon: string;
    color: 'blue' | 'purple' | 'red' | 'green' | 'yellow' | 'gray';
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export interface CommitByDay {
    date: string;
    count: number;
}

export interface CommitByWeek {
    week: string;
    count: number;
}

export interface StateCount {
    [key: string]: number;
}

export interface TopDeveloper {
    name: string;
    username: string;
    avatar: string | null;
    commits: number;
    active_days: number;
    prs: number;
}

export interface TopReviewer {
    name: string;
    username: string;
    avatar: string | null;
    total_reviews: number;
    approved: number;
    changes_requested: number;
    approval_rate: number;
}

export interface RecentActivity {
    type: 'commit' | 'pull_request' | 'issue' | 'review';
    message: string;
    author: string;
    repository: string;
    date: string;
    url?: string;
}

export interface DeveloperStats {
    name: string;
    username: string;
    avatar: string | null;
    commits: number;
    prs: number;
    reviews: number;
    active_days: number;
    productivity_score: number;
    avg_commit_size: number;
}

export interface DeveloperActivity {
    name: string;
    username: string;
    avatar: string | null;
    activity: Array<{
        date: string;
        count: number;
    }>;
    total: number;
}

export interface CodeQualityMetrics {
    approval_rate: number;
    changes_requested_rate: number;
    merge_rate: number;
    avg_reviews_per_pr: number;
}

export interface PrCycleTime {
    avg: number;
    min: number;
    max: number;
    median: number;
    p25: number;
    p75: number;
}

export interface DeveloperRanking {
    most_commits: DeveloperStats | null;
    most_prs: DeveloperStats | null;
    most_reviews: DeveloperStats | null;
    highest_productivity: DeveloperStats | null;
}

export interface TeamMember {
    name: string;
    username: string;
    avatar: string | null;
    commits: number;
    prs: number;
    reviews: number;
    last_active: string;
    status: 'active' | 'idle' | 'away';
}

export interface TopContributor {
    name: string;
    username: string;
    avatar: string | null;
    score: number;
    commits: number;
    prs: number;
    reviews: number;
}

export interface TopCommitter {
    name: string;
    username: string;
    avatar: string | null;
    commits: number;
}

export interface DaysWithoutCommit {
    name: string;
    username: string;
    avatar: string | null;
    days_without_commit: number;
    last_commit_date: string | null;
}

// =============================================
// TABS
// =============================================

export type MetricsTab = 'repository' | 'project' | 'developer';

// =============================================
// REPOSITORY TAB
// =============================================

export interface RepositoryMetrics {
    // Cards
    cards: IMetricCard[];

    // Charts
    commits_by_day: CommitByDay[];
    commits_by_week: CommitByWeek[];
    prs_by_state: StateCount;
    issues_by_state: StateCount;
    reviews_by_state: StateCount;

    // Tables
    top_developers: TopDeveloper[];
    top_reviewers: TopReviewer[];
    recent_activity: RecentActivity[];

    // Advanced statistics
    avg_commits_per_day: number;
    days_without_commit: DaysWithoutCommit[];
    avg_pr_merge_time: number;
    avg_issue_close_time: number;
    active_developers: number;

    developer_stats: DeveloperStats[];
    developer_activity_heatmap: DeveloperActivity[];
    code_quality: CodeQualityMetrics;
    pr_cycle_time: PrCycleTime;
    developer_ranking: DeveloperRanking;

    team_members: TeamMember[];
    stale_prs: number;
    prs_needing_review: number;
    inactive_developers: number;

    pr_merge_rate: number;
    prs_merged: number;
    prs_total: number;

    /** Top contributors (commits + PRs + reviews) */
    top_contributors: TopContributor[];
    top_committers: TopCommitter[];

    // Projects
    active_projects: number;
    total_projects: number;

    // Sprints
    active_sprints: number;
    total_sprints: number;
    sprint_completion_rate: number;

    // Issues
    open_issues: number;
    total_issues: number;
    avg_issue_resolution_time: number;

    // Tasks
    tasks_in_progress: number;
    tasks_in_review: number;
    total_tasks: number;
    task_completion_rate: number;
    overdue_tasks: number;
}

// =============================================
// PROJECT TAB
// =============================================

export interface ProjectSummary {
    active_projects: number;
    total_projects: number;
    total_developers: number;
    total_tasks: number;
    avg_tasks_per_project: number;
}

export interface ProjectWithStats {
    id: number;
    name: string;
    status: string;
    team: string | null;
    developers_count: number;
    tasks_count: number;
    sprints_count: number;
    progress: number;
    tasks_by_status: {
        backlog: number;
        todo: number;
        in_progress: number;
        review: number;
        done: number;
    };
}

export interface DeveloperByProject {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    tasks_total: number;
    tasks_open: number;
    tasks_done: number;
}

export interface DevelopersByProject {
    project_id: number;
    project_name: string;
    developers: DeveloperByProject[];
    developers_count: number;
    developers_with_tasks: number;
    developers_without_tasks: number;
}

export interface TasksDistribution {
    project_id: number;
    project_name: string;
    tasks_count: number;
}

export interface SprintsByProject {
    project_id: number;
    project_name: string;
    total_sprints: number;
    active_sprints: number;
    completed_sprints: number;
}

export interface ProjectMetrics {
    summary: ProjectSummary;
    projects: ProjectWithStats[];
    developers_by_project: DevelopersByProject[];
    tasks_distribution: TasksDistribution[];
    sprints_by_project: SprintsByProject[];
}

export interface DeveloperSummary {
    total: number;
    active: number;
    inactive: number;
    avg_commits: number;
}

export interface DeveloperRankingRow {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    commits: number;
    prs: number;
    reviews: number;
    issues: number;
    tasks_total: number;
    tasks_open: number;
    tasks_done: number;
    projects: number;
}

export interface TasksByDeveloperRow {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    open: number;
    in_progress: number;
    review: number;
    done: number;
    total: number;
}

export interface ProjectsByDeveloperRow {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    projects: Array<{
        id: number;
        name: string;
    }>;
    projects_count: number;
}

export interface DeveloperMetrics {
    summary: DeveloperSummary;
    ranking: DeveloperRankingRow[];
    tasks_by_developer: TasksByDeveloperRow[];
    projects_by_developer: ProjectsByDeveloperRow[];
}
