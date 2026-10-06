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
    kind: 'created' | 'updated' | 'deleted' | 'info';
}

const HIDDEN_FIELDS = ['id', 'created_at', 'updated_at', 'deleted_at'];

const DIFF_TYPES: TActivityLogType[] = ['created', 'updated', 'deleted'];

export function buildActivityDiff(log: IActivityLogShow): ActivityDiffRow[] {
    const changes = log.changes;

    if (!changes) return [];

    // created / updated / deleted → before/after o attributes
    if (DIFF_TYPES.includes(log.type)) {
        const oldVals =
            (changes.before as Record<string, unknown> | undefined) ??
            (changes.old as Record<string, unknown> | undefined) ??
            {};
        const newVals =
            (changes.after as Record<string, unknown> | undefined) ??
            (changes.new as Record<string, unknown> | undefined) ??
            (changes.attributes as Record<string, unknown> | undefined) ??
            {};

        const fields = new Set([
            ...Object.keys(oldVals),
            ...Object.keys(newVals),
        ]);

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

    // imported / synced / fetched → plano key/value
    return Object.entries(changes)
        .filter(([field]) => !HIDDEN_FIELDS.includes(field))
        .map(([field, value]) => ({
            field,
            oldValue: null,
            newValue: value,
            kind: 'info' as const,
        }));
}

export function formatActivityValue(value: unknown): string {
    if (value === null || value === undefined) return '—';

    if (typeof value === 'boolean') return value ? 'true' : 'false';

    if (typeof value === 'object') return JSON.stringify(value);

    return String(value);
}
