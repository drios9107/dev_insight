
export const TaskPriorityEnum = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
}

export const TaskStatusEnum = {
    backlog: 'Backlog',
    todo: 'Todo',
    in_progress: 'In_progress',
    review: 'Review',
    done: 'Done',
    cancelled: 'Cancelled',
}


export type TTaskPriority = 'low' | 'medium' | 'high' | 'critical'

export type TTaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'