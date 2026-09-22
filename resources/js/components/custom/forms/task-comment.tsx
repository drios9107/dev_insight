import { router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { IComment } from '@/types/models/comment';
import CommentItem from '../comment-item';
import { SendForm } from '../send-form';

interface TaskCommentsProps {
    taskId: number;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
    const { props } = usePage();

    const [comments, setComments] = useState<IComment[]>([]);
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/task/${taskId}/comments`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load');
            }

            const data = await response.json();
            setComments(data.data);
        } catch (error) {
            toast.error('Failed to load comments');
            console.log('***error', error);
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = useCallback(() => {
        if (!content.trim()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        router.post(
            `/task/${taskId}/comment`,
            { content },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setContent('');
                    setErrors({});
                    fetchComments();
                },
                onError: (errors) => {
                    setErrors(errors);
                    toast.error(errors.content || 'Failed to add comment');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    }, [content, taskId, fetchComments]);

    const handleDelete = useCallback(
        (commentId: number) => {
            router.delete(`/comment/${commentId}`, {
                preserveScroll: true,
                onSuccess: () => fetchComments(),
                onError: () => toast.error('Failed to delete comment'),
            });
        },
        [fetchComments],
    );

    const commentCount = useMemo(() => comments.length, [comments.length]);

    const canSubmit = useMemo(
        () => !isSubmitting && content.trim().length > 0,
        [isSubmitting, content],
    );

    return (
        <div className="mt-6 space-y-4 border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700">
                💬 Comments ({commentCount})
            </h3>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <p className="py-4 text-center text-sm text-gray-400">
                        Loading...
                    </p>
                ) : comments.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">
                        No comments yet. Be the first!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onDelete={handleDelete}
                            alignment={
                                comment.user.id === props?.auth?.user?.id
                                    ? 'right'
                                    : 'left'
                            }
                        />
                    ))
                )}
            </div>

            {/* Form */}
            <SendForm
                content={content}
                setContent={setContent}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                canSubmit={canSubmit}
            />
        </div>
    );
}
