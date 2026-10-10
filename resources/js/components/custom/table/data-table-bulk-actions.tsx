'use client';

import { Button, Text } from '@radix-ui/themes';
import { Trash2, X } from 'lucide-react';

interface BulkActionsProps {
    count: number;
    onDelete: () => void;
    onClear: () => void;
}

export function DataTableBulkActions({
    count,
    onDelete,
    onClear,
}: BulkActionsProps) {
    if (count === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 shadow-sm">
            <div className="flex items-center gap-3">
                <Text size="2" className="text-blue-900">
                    {count} Selected
                </Text>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="soft"
                    color="gray"
                    size="1"
                    onClick={onClear}
                    className="flex cursor-pointer items-center justify-center gap-1 transition-opacity hover:opacity-70"
                >
                    <X className="h-3.5 w-3.5" />
                    Clear
                </Button>
                <Button
                    variant="solid"
                    color="red"
                    size="1"
                    onClick={onDelete}
                    className="flex cursor-pointer items-center justify-center gap-1 transition-opacity hover:opacity-70"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                </Button>
            </div>
        </div>
    );
}
