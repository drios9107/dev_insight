// types/metrics.ts

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

export interface CodeChurn {
    additions: number;
    deletions: number;
    total: number;
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
    additions: number;
    deletions: number;
    net_change: number;
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

// =============================================
// NUEVOS TIPOS PARA LAS NUEVAS MÉTRICAS
// =============================================

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
// DASHBOARD METRICS COMPLETO
// =============================================

export interface DashboardMetrics {
    // Cards
    cards: IMetricCard[];

    // Gráficos
    commits_by_day: CommitByDay[];
    commits_by_week: CommitByWeek[];
    prs_by_state: StateCount;
    issues_by_state: StateCount;
    reviews_by_state: StateCount;

    // Tablas
    top_developers: TopDeveloper[];
    top_reviewers: TopReviewer[];
    recent_activity: RecentActivity[];

    // Estadísticas avanzadas
    avg_commits_per_day: number;
    days_without_commit: DaysWithoutCommit[];
    avg_pr_merge_time: number;
    avg_issue_close_time: number;
    active_developers: number;
    code_churn: CodeChurn;

    developer_stats: DeveloperStats[];
    developer_activity_heatmap: DeveloperActivity[];
    code_quality: CodeQualityMetrics;
    pr_cycle_time: PrCycleTime;
    developer_ranking: DeveloperRanking;

    // =============================================
    // NUEVAS MÉTRICAS
    // =============================================

    /** Lista de miembros del equipo con estado */
    team_members: TeamMember[];

    /** PRs sin actividad en más de 7 días */
    stale_prs: number;

    /** PRs abiertos sin ninguna review */
    prs_needing_review: number;

    /** Desarrolladores sin commits en más de 7 días */
    inactive_developers: number;

    /** Porcentaje de PRs que fueron mergeados */
    pr_merge_rate: number;

    /** Total de PRs mergeados */
    prs_merged: number;

    /** Total de PRs */
    prs_total: number;

    /** Top contribuyentes (commits + PRs + reviews) */
    top_contributors: TopContributor[];

    /** Top committers */
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
// PROPS DE LA PÁGINA
// =============================================

export interface MetricsPageProps {
    metrics: DashboardMetrics;
    repositories: Array<{
        id: number;
        full_name: string;
    }>;
    selected_repository: number | null;
    title: string;
}