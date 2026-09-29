import type { IProject } from './project';

export type TSprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export interface ISprint {
    id: number;
    name: string;
    status: TSprintStatus;
    start_date: string | null;
    end_date: string | null;
    velocity: number | null;
    actual_velocity: number | null;

    project: Pick<IProject, 'id' | 'name'> | null;

    created_at: string;
    updated_at: string;
}

export interface ISprintList extends ISprint {}

export interface ISprintShow extends ISprint {
    goal: string | null;

    tasks_by_status: {
        backlog: number;
        todo: number;
        in_progress: number;
        review: number;
        done: number;
    } | null;

    tasks_count: number | null;
}
