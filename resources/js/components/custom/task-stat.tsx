import { Link } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

interface TaskStatProps {
    label: string;
    value: number;
    color: string;
    href?: string;
}

export default function TaskStat({ label, value, color, href }: TaskStatProps) {
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

    const getClassName = useCallback(
        (hasLink: boolean) =>
            `rounded-lg p-2 text-center ${colorMap[color]} ${
                hasLink
                    ? 'transition-transform hover:scale-105 cursor-pointer'
                    : ''
            }`,
        [color, colorMap],
    );

    const content = useMemo(
        () => (
            <>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-[10px]">{label}</p>
            </>
        ),
        [value, label],
    );

    if (!href) {
        return <div className={getClassName(false)}>{content}</div>;
    }

    return (
        <Link href={href} className={getClassName(true)}>
            {content}
        </Link>
    );
}
