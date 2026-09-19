import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IComment } from "@/types/models/comment";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentItemProps {
    comment: IComment;
    onDelete: (id: number) => void;
    alignment?: 'left' | 'right';
}

function CommentItem({ comment, onDelete, alignment = 'left' }: CommentItemProps) {
    const isRight = alignment === 'right';

    return (
        <div className={cn(
            "flex gap-3 group",
            isRight && "flex-row-reverse"
        )}>
            <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={comment?.user?.avatar} />
                <AvatarFallback className="text-xs">
                    {comment.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "flex-1 min-w-0",
                isRight && "flex flex-col items-end"
            )}>
                <div className={cn(
                    "flex items-center gap-2",
                    isRight && "flex-row-reverse"
                )}>
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">{comment.created_at}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>

                <div className={cn(
                    "mt-1 px-3 py-2 rounded-lg max-w-[80%]",
                    isRight
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-700 rounded-tl-none"
                )}>
                    <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CommentItem;