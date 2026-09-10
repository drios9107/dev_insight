// resources/js/components/metrics/RankingCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReactNode } from 'react';

interface RankingItem {
    name: string;
    username: string;
    avatar: string | null;
    value: number;
    label: string;
}

interface RankingCardProps {
    title: string;
    items: RankingItem[];
    icon?: ReactNode;
}

export function RankingCard({ title, items, icon }: RankingCardProps) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-400 w-6 text-right">
                                    #{index + 1}
                                </span>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={item.avatar || undefined} />
                                    <AvatarFallback>
                                        {item.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-400">@{item.username}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">{item.value}</p>
                                <p className="text-xs text-gray-400">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}