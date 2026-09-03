import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';

interface ITableActions {
    item: any,
    onEdit?: (v: any) => void;
    onDelete?: (id: number) => void;
    onSync?: (v: any) => void;
    isGithubItem: Boolean;
}

export function TableActions({
    item,
    onEdit,
    onDelete,
    onSync,
    isGithubItem = false,
}: ITableActions) {
    return (
        <div className="flex items-center justify-end gap-1">
            {/* Botón Editar */}
            {onEdit && !isGithubItem && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className='text-blue-600 cursor-pointer'
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            )}

            {/* Botón Eliminar */}
            {onDelete && !isGithubItem && (
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