import { IUser } from "./user";

export interface ITeam {
    id: number;
    name: string;
    description: string;
    owner: IUser;
    avatar_url: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
} 