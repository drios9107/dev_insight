export interface IGithubRepository {
    id: number;
    github_id: string;
    name: string;
    full_name: string;
    url: string;
    description: string;
    is_private: boolean;
    default_branch: string;
    last_synced_at?: string;
    created_at: string;
    updated_at: string;
}
