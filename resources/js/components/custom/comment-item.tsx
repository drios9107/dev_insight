import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IComment } from '@/types/models/comment';

interface CommentItemProps {
    comment: IComment;
    onDelete: (id: number) => void;
    alignment?: 'left' | 'right';
}

function CommentItem({
    comment,
    onDelete,
    alignment = 'left',
}: CommentItemProps) {
    const isRight = alignment === 'right';

    return (
        <div className={cn('group flex gap-3', isRight && 'flex-row-reverse')}>
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment?.user?.avatar} />
                <AvatarFallback className="text-xs">
                    {comment.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    'min-w-0 flex-1',
                    isRight && 'flex flex-col items-end',
                )}
            >
                <div
                    className={cn(
                        'flex items-center gap-2',
                        isRight && 'flex-row-reverse',
                    )}
                >
                    <span className="text-sm font-medium">
                        {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                        {comment.created_at}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(comment.id)}
                        className="h-6 w-6 p-0 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-700"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>

                <div
                    className={cn(
                        'mt-1 max-w-[80%] rounded-lg px-3 py-2',
                        isRight
                            ? 'rounded-tr-none bg-blue-500 text-white'
                            : 'rounded-tl-none bg-gray-100 text-gray-700',
                    )}
                >
                    <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CommentItem;
