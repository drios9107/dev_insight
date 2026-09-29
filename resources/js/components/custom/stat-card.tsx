import { Card, CardContent } from '../ui/card';

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number | string;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50',
        purple: 'text-purple-600 bg-purple-50',
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50',
        gray: 'text-gray-600 bg-gray-50',
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
                <div className={`rounded-lg p-2 ${colorMap[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default StatCard;
