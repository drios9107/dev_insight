// resources/js/components/custom/metrics/section-components/action-card.tsx

import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ActionCardProps {
    label: string;
    value: number | string;
    icon?: ReactNode;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
    sub?: string;
    link?: string;
    onClick?: () => void;
}

const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    gray: 'text-gray-600 bg-gray-50',
};

export function ActionCard({
    label,
    value,
    icon,
    color = 'gray',
    sub,
    link,
    onClick,
}: ActionCardProps) {
    const CardWrapper = link ? Link : 'div';
    const wrapperProps = link ? { href: link, className: 'block' } : {};

    return (
        <CardWrapper {...wrapperProps}>
            <Card
                className={`border-0 shadow-md transition-all duration-200 hover:shadow-lg ${
                    link || onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
                }`}
                onClick={onClick}
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                {label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {value}
                            </p>
                            {sub && (
                                <p className="mt-1 text-xs text-gray-400">
                                    {sub}
                                </p>
                            )}
                        </div>
                        {icon && (
                            <div
                                className={`rounded-lg p-2 ${colorMap[color]}`}
                            >
                                {icon}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </CardWrapper>
    );
}
