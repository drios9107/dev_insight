import { Button } from '@/components/ui/button';
import { Pencil, Trash2, RefreshCw, Database, Eye } from 'lucide-react';

interface ITableActions {
    item: any,
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
                    className='text-yellow-600 cursor-pointer'
                >
                    <Database className="w-4 h-4" />
                </Button>
            )}

            {onView && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(item)}
                    className='text-green-600 cursor-pointer'
                >
                    <Eye className="w-4 h-4" />
                </Button>
            )}

            {onEdit && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className='text-blue-600 cursor-pointer'
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            )}

            {onDelete && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className='text-red-600 cursor-pointer'
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}