// resources/js/components/metrics/StatCard.tsx

import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    label: string;
    value: string | number;
    className?: string;
}

export function StatCard({ label, value, className = '' }: StatCardProps) {
    return (
        <Card className={`border-0 shadow-md h-full ${className}`}>
            <CardContent className="p-4 flex flex-col h-full justify-center">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </CardContent>
        </Card>
    );
}