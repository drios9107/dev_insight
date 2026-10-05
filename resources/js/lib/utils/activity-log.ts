import type {
    IActivityLogShow,
    TActivityLogType,
} from '@/types/models/activity-log';

export function getActivityLogTypeColor(
    type: TActivityLogType,
): 'default' | 'success' | 'warning' | 'destructive' | 'info' {
    const mapping: Record<
        TActivityLogType,
        'default' | 'success' | 'warning' | 'destructive' | 'info'
    > = {
        created: 'success',
        updated: 'warning',
        deleted: 'destructive',
        imported: 'info',
        synced: 'default',
        fetched: 'info',
    };

    return mapping[type] ?? 'default';
}

export interface ActivityDiffRow {
    field: string;
    oldValue: unknown;
    newValue: unknown;
    kind: 'created' | 'updated' | 'deleted';
}

const HIDDEN_FIELDS = ['id', 'created_at', 'updated_at', 'deleted_at'];

export function buildActivityDiff(log: IActivityLogShow): ActivityDiffRow[] {
    const changes = log.changes;

    if (!changes) return [];

    // created → attributes
    // updated → before / after
    // deleted → attributes (o before según cómo loguees)
    const oldVals = changes.before ?? changes.old ?? {};
    const newVals = changes.after ?? changes.new ?? changes.attributes ?? {};

    const fields = new Set([...Object.keys(oldVals), ...Object.keys(newVals)]);

    return Array.from(fields)
        .filter((field) => !HIDDEN_FIELDS.includes(field))
        .map((field) => {
            const oldValue = oldVals[field];
            const newValue = newVals[field];

            let kind: ActivityDiffRow['kind'] = 'updated';
            if (oldValue === undefined) kind = 'created';
            else if (newValue === undefined) kind = 'deleted';

            return { field, oldValue, newValue, kind };
        });
}

export function formatActivityValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}
