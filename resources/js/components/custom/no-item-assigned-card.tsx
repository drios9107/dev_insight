import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

export default function NoItemAssignedCard({
    text,
    className,
    contentClassName,
}: {
    text: string;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <Card className={cn('col-span-full border-0 shadow-md', className)}>
            <CardContent
                className={cn(
                    'py-8 text-center text-gray-400',
                    contentClassName,
                )}
            >
                {text}
            </CardContent>
        </Card>
    );
}
