export interface IGithubUser {
    id: number;
    name: string;
    username: string;
    github_id: string;
    email: string;
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}
