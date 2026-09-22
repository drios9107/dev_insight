import type { TTaskPriority, TTaskStatus } from '@/enums/task';

type BadgeVariant =
    | 'default'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'success'
    | 'destructive'
    | 'outline';

export function getTaskStatusColor(status: TTaskStatus): BadgeVariant {
    const mapping: Record<TTaskStatus, BadgeVariant> = {
        backlog: 'default',
        todo: 'secondary',
        in_progress: 'info',
        review: 'warning',
        done: 'success',
        cancelled: 'destructive',
    };

    return mapping[status];
}

export function getTaskPriorityColor(priority: TTaskPriority): BadgeVariant {
    const mapping: Record<TTaskPriority, BadgeVariant> = {
        low: 'default',
        medium: 'info',
        high: 'warning',
        critical: 'destructive',
    };

    return mapping[priority];
}
