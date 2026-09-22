import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
    fullScreen?: boolean;
    className?: string;
}

export function Loader({ fullScreen = false, className }: LoaderProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-center',
                fullScreen
                    ? 'absolute min-h-screen w-full'
                    : 'absolute inset-0 z-50 bg-white/10 backdrop-blur-sm',
                className,
            )}
        >
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
}
