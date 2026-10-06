import type { IActivityLogShow } from '@/types/models/activity-log';
import {
    buildActivityDiff,
    formatActivityValue,
} from '@/lib/utils/activity-log';

interface ActivityChangesProps {
    item: IActivityLogShow;
}

export function ActivityChanges({ item }: ActivityChangesProps) {
    const rows = buildActivityDiff(item);

    if (rows.length === 0) {
        return null;
    }

    const isInfo =
        item.type === 'imported' ||
        item.type === 'synced' ||
        item.type === 'fetched';

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                {isInfo ? 'Details' : 'Changes'}
            </h3>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                        <tr>
                            <th className="px-3 py-2 text-left font-medium">
                                Field
                            </th>
                            {isInfo ? (
                                <th className="px-3 py-2 text-left font-medium">
                                    Value
                                </th>
                            ) : (
                                <>
                                    <th className="px-3 py-2 text-left font-medium">
                                        Old
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium">
                                        New
                                    </th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rows.map((row) => (
                            <tr key={row.field} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-700">
                                    {row.field}
                                </td>
                                {isInfo ? (
                                    <td className="px-3 py-2 text-gray-900">
                                        {formatActivityValue(row.newValue)}
                                    </td>
                                ) : (
                                    <>
                                        <td className="px-3 py-2 text-gray-500">
                                            {row.kind === 'created'
                                                ? '—'
                                                : formatActivityValue(
                                                      row.oldValue,
                                                  )}
                                        </td>
                                        <td className="px-3 py-2 text-gray-900">
                                            {row.kind === 'deleted' ? (
                                                <span className="text-red-600">
                                                    deleted
                                                </span>
                                            ) : (
                                                formatActivityValue(
                                                    row.newValue,
                                                )
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ActivityChanges;
