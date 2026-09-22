import type { TTaskPriority, TTaskStatus } from '@/enums/task';
import type { IUser } from '../user';
import type { IGithubsIssue } from './github-issue';
import type { IProject } from './project';
import type { ISprint } from './sprint';

export interface ITask {
    id: number;
    title: string;
    description: string;
    project?: IProject;
    assignee?: IUser;
    sprint?: ISprint;
    reporter: IUser;
    github_issue: IGithubsIssue;
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
