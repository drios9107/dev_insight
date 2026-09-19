import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ShadTextarea from '@/components/custom/inputs/shad-textarea';

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
        <div className="flex gap-2 items-start">
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
                className="flex-shrink-0 mt-1"
            >
                <Send className="w-4 h-4" />
            </Button>
        </div>
    );
}