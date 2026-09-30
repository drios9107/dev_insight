import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

export default function TaskStat({
    label,
    value,
    color,
    href,
}: {
    label: string;
    value: number;
    color: string;
    href: string;
}) {
    const colorMap: Record<string, string> = useMemo(
        () => ({
            gray: 'text-gray-600 bg-gray-50',
            blue: 'text-blue-600 bg-blue-50',
            yellow: 'text-yellow-600 bg-yellow-50',
            purple: 'text-purple-600 bg-purple-50',
            green: 'text-green-600 bg-green-50',
            red: 'text-red-600 bg-red-50',
        }),
        [],
    );

    return (
        <Link
            href={href}
            className={`rounded-lg p-2 text-center transition-transform hover:scale-105 ${colorMap[color]}`}
        >
            <p className="text-lg font-bold">{value}</p>
            <p className="text-[10px]">{label}</p>
        </Link>
    );
}
