export interface IGithubUser {
    id: number;
    github_id: number;
    username: string;
    email: string | null;
    name: string | null;
    avatar_url: string | null;
    display_name: string;
    commits_count: number;
    prs_count: number;
    reviews_count: number;
    last_synced_at: string | null;
    created_at: string;
}