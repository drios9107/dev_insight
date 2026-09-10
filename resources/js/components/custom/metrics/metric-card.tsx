// resources/js/components/metrics/MetricCard.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
    const wrapperProps = route ? { href: route, className: 'block transition-transform duration-200 hover:scale-[1.02]' } : {};

    return (
        <CardWrapper {...wrapperProps}>
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" style={{ height }}>
                <div className={`h-1 w-full bg-gradient-to-r ${colorMap[color]}`} />
                <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between flex-1 gap-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                {label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                {value.toLocaleString()}
                            </p>
                            {sub && <p className="text-sm text-gray-400">{sub}</p>}
                            {trend !== 'neutral' && (
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendIcon className={`w-4 h-4 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                                    <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {trendValue}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white shadow-lg flex-shrink-0`}>
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CardWrapper>
    );
}