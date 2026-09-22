// resources/js/components/metrics/MetricCard.tsx

import { Link } from '@inertiajs/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
    label: string;
    value: number;
    icon: ReactNode;
    color: 'blue' | 'purple' | 'red' | 'green' | 'yellow' | 'gray';
    sub?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    route?: string;
    height?: string;
}

const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    gray: 'from-gray-500 to-gray-600',
};

const trendMap = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
};

export function MetricCard({
    label,
    value,
    icon,
    color,
    sub,
    trend = 'neutral',
    trendValue,
    route,
    height = '228px',
}: MetricCardProps) {
    const TrendIcon = trendMap[trend];
    const CardWrapper = route ? Link : 'div';
    const wrapperProps = route
        ? {
              href: route,
              className:
                  'block transition-transform duration-200 hover:scale-[1.02]',
          }
        : {};

    return (
        <CardWrapper {...wrapperProps} className="w-full">
            <Card
                className="cursor-pointer overflow-hidden border-0 shadow-md transition-shadow duration-200 hover:shadow-lg"
                style={{ height }}
            >
                <div
                    className={`h-1 w-full bg-gradient-to-r ${colorMap[color]}`}
                />
                <CardContent className="flex h-full flex-col p-6">
                    <div className="flex flex-1 items-start justify-between gap-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                                {label}
                            </p>
                            <p className="text-3xl font-bold tracking-tight text-gray-900">
                                {value.toLocaleString()}
                            </p>
                            {sub && (
                                <p className="text-sm text-gray-400">{sub}</p>
                            )}
                            {trend !== 'neutral' && (
                                <div className="mt-1 flex items-center gap-1">
                                    <TrendIcon
                                        className={`h-4 w-4 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {trendValue}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div
                            className={`rounded-xl bg-gradient-to-br p-3 ${colorMap[color]} flex-shrink-0 text-white shadow-lg`}
                        >
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CardWrapper>
    );
}
