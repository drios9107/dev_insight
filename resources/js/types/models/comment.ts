import { IUser } from '../user';
import type { ITask } from './task';

export interface IComment {
    id: number;
    content: string;
    is_internal: boolean;

    user: Pick<IUser, 'id' | 'name' | 'avatar_url'>;

    created_at: string;
    updated_at?: string;
}

export interface ICommentList extends IComment {
    task?: Pick<ITask, 'id' | 'title'>;
    parent?: Pick<IComment, 'id' | 'content'>;
    replies?: ICommentList[];
}

export interface ICommentShow extends IComment {
    task: Pick<ITask, 'id' | 'title'>;
    parent?: Pick<IComment, 'id' | 'content'>;
    replies: ICommentList[];
}