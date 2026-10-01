import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function CustomAvatar({
    src,
    title,
    alt,
    className,
    fallbackClassName,
}: {
    title: string;
    src?: string | undefined;
    alt?: string;
    className?: string;
    fallbackClassName?: string;
}) {
    return (
        <Avatar className={cn('h-7 w-7', className)}>
            {src && <AvatarImage src={src} alt={alt ?? src} />}
            <AvatarFallback className={cn('text-xs', fallbackClassName)}>
                {title}
            </AvatarFallback>
        </Avatar>
    );
}
