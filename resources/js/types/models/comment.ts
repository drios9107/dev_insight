// types/models/comment.ts

import { User } from "../auth";


export interface IComment {
    id: number;
    content: string;
    is_internal: boolean;
    user: Pick<User, 'id' | 'name' | 'avatar'>;
    task?: {
        id: number;
        title: string;
    };
    parent?: {
        id: number;
        content: string;
    };
    replies?: IComment[];
    created_at: string;
    updated_at?: string;
}