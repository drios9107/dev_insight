import type { IUser } from '../user';
import type { IGithubsIssue } from './github-issue';
import type { IGithubUser } from './github-user';
import type { IProject } from './project';
import type { ISprint } from './sprint';

export type TTaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
export type TTaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ITask {
    id: number;
    title: string;
    status: TTaskStatus;
    priority: TTaskPriority;
    story_points: number | null;
    due_date: string | null;
    completed_at: string | null;

    project: Pick<IProject, 'id' | 'name'> | null;
    sprint: Pick<ISprint, 'id' | 'name'> | null;
    assignee: Pick<IGithubUser, 'id' | 'username' | 'display_name' | 'avatar'> | null;
    reporter: Pick<IUser, 'id' | 'name' | 'avatar_url'> | null;

    created_at: string;
    updated_at: string;
}

export interface ITaskList extends ITask { }

export interface ITaskShow extends ITask {
    description: string | null;
    hours_estimate: number | null;
    hours_spent: number | null;
    order: number | null;

    github_issue: Pick<IGithubsIssue, 'id' | 'number' | 'title' | 'state'> | null;
}