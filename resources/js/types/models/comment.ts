import { IUser } from "../user";
import { ITask } from "./task";

export interface IComment {
    id: number;
    content: string;
    user: IUser;
    task: ITask;
    parent?: IComment;
    is_internal: boolean;
    created_at: string;
    updated_at: string;
}

