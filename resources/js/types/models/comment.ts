import { IGithubUser } from "../github-user";
import { ITask } from "./task";

export interface IComment {
    id: number;
    content: string;
    github_user: IGithubUser;
    task: ITask;
    parent?: IComment;
    is_internal: boolean;
    created_at: string;
    updated_at: string;
}

