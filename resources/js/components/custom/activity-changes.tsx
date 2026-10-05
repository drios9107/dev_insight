import {
    buildActivityDiff,
    formatActivityValue,
} from '@/lib/utils/activity-log';
import { IActivityLogShow } from '@/types/models/activity-log';

export default function ActivityChanges({ item }: { item: IActivityLogShow }) {
    const rows = buildActivityDiff(item);

    if (rows.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Changes
            </h3>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                        <tr>
                            <th className="px-3 py-2 text-left font-medium">
                                Field
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Old
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                New
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rows.map((row) => (
                            <tr key={row.field} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-700">
                                    {row.field}
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                    {row.kind === 'created'
                                        ? '—'
                                        : formatActivityValue(row.oldValue)}
                                </td>
                                <td className="px-3 py-2 text-gray-900">
                                    {row.kind === 'deleted' ? (
                                        <span className="text-red-600">
                                            deleted
                                        </span>
                                    ) : (
                                        formatActivityValue(row.newValue)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
