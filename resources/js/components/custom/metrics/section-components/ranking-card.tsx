// resources/js/components/metrics/RankingCard.tsx

import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Card className="w-full border-0 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg p-2 transition-colors duration-150 hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 text-right text-sm font-medium text-gray-400">
                                    #{index + 1}
                                </span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={item.avatar || undefined}
                                    />
                                    <AvatarFallback>
                                        {item.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        @{item.username}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    {item.value}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
