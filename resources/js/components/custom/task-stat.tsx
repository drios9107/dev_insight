import { useMemo } from 'react';

function TaskStat({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    const colorMap: Record<string, string> = useMemo(
        () => ({
            gray: 'text-gray-600 bg-gray-50',
            blue: 'text-blue-600 bg-blue-50',
            yellow: 'text-yellow-600 bg-yellow-50',
            purple: 'text-purple-600 bg-purple-50',
            green: 'text-green-600 bg-green-50',
        }),
        [],
    );

    return (
        <div className={`rounded-lg p-3 text-center ${colorMap[color]}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs">{label}</p>
        </div>
    );
}

export default TaskStat;
