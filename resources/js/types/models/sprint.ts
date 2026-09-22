import type { IProject } from './project';

export interface ISprint {
    id: number;
    name: string;
    goal: string;
    project: IProject;
    start_date: string;
    end_date: string;
    status: TSprintStatus;
    velocity: number;
    actual_velocity: number;
    created_at: string;
    updated_at: string;
}

export type TSprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';
