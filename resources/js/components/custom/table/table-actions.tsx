import { Pencil, Trash2, Database, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ITableActions {
    item: any;
    onView?: (v: any) => void;
    onEdit?: (v: any) => void;
    onDelete?: (id: number) => void;
    onSync?: (v: any) => void;
}

export function TableActions({
    item,
    onView,
    onEdit,
    onDelete,
    onSync,
}: ITableActions) {
    return (
        <div className="flex items-center justify-end gap-1">
            {onSync && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSync(item)}
                    className="cursor-pointer text-yellow-600"
                >
                    <Database className="h-4 w-4" />
                </Button>
            )}

            {onView && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(item)}
                    className="cursor-pointer text-green-600"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            )}

            {onEdit && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="cursor-pointer text-blue-600"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}

            {onDelete && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="cursor-pointer text-red-600"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
