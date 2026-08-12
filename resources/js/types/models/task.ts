import { TTaskPriority, TTaskStatus } from "@/enums/task";
import { IUser } from "../user";
import { IProject } from "./project";
import { ISprint } from "./sprint";

export interface ITask {
    id: number;
    title: string;
    description: string;
    project?: IProject;
    assignee?: IUser;
    sprint?: ISprint;
    reporter: IUser;
    // @todo: complete missing relations
    // github_issue_id

    status: TTaskStatus;
    priority: TTaskPriority;
    due_date: string;
    completed_at: string;
    story_points: number;
    hours_estimate: number;
    hours_spent: number;
    order: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
} 