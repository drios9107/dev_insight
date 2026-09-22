import { Send } from 'lucide-react';
import ShadTextarea from '@/components/custom/inputs/shad-textarea';
import { Button } from '@/components/ui/button';

interface SendFormProps {
    placeholder?: string;
    content: string;
    setContent: (value: string) => void;
    errors: Record<string, string>;
    isSubmitting: boolean;
    handleSubmit: () => void;
    canSubmit: boolean;
}

export function SendForm({
    placeholder = 'Write a comment... (Enter to send)',
    content,
    setContent,
    errors,
    isSubmitting,
    handleSubmit,
    canSubmit,
}: SendFormProps) {
    return (
        <div className="flex items-start gap-2">
            <div className="flex-1">
                <ShadTextarea
                    label=""
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    errors={errors}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                    rows={2}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
            </div>
            <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                size="icon"
                className="mt-1 flex-shrink-0"
            >
                <Send className="h-4 w-4" />
            </Button>
        </div>
    );
}
