import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

export interface IColumnHeaderProps {
    field: string;
    label: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onSort?: (field: string) => void | null;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export function ColumnHeader({
    field,
    label,
    sortField,
    sortDirection,
    onSort,
    align = 'left',
    className = '',
}: IColumnHeaderProps) {
    const isSorted = sortField === field;

    return (
        <th
            className={`
                px-4 py-3 text-${align} bg-blue-100
                ${!!onSort ? 'cursor-pointer hover:bg-gray-50' : ''}
                ${className}
            `}
            onClick={() => onSort?.(field)}
        >
            <div className={`flex items-center gap-1 justify-${align}`}>
                {label}
                {!!onSort && (
                    <span className="inline-flex items-center">
                        {!isSorted && <ChevronsUpDown className="w-4 h-4 text-gray-400" />}
                        {isSorted && sortDirection === 'asc' && <ArrowUp className="w-4 h-4" />}
                        {isSorted && sortDirection === 'desc' && <ArrowDown className="w-4 h-4" />}
                    </span>
                )}
            </div>
        </th>
    );
}