import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ISimpleTableColumn<T = any> {
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    render?: (value: any, row: T) => ReactNode;
}

interface SimpleTableProps<T = any> {
    columns: ISimpleTableColumn<T>[];
    data: T[];
    emptyMessage?: string;
    emptyColSpan?: number;
    cardClassName?: string;
    tableClassName?: string;
    rowClassName?: string;
}

export default function SimpleTable<T extends Record<string, any>>({
    columns,
    data,
    emptyMessage = 'No data found',
    cardClassName,
    tableClassName,
    rowClassName,
}: SimpleTableProps<T>) {
    return (
        <Card
            className={cn(
                'overflow-hidden border-0 py-0 shadow-md',
                cardClassName,
            )}
        >
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className={cn('w-full', tableClassName)}>
                        <thead>
                            <tr className="border-b bg-gray-50">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            'px-4 py-3 text-sm font-medium text-gray-500',
                                            col.align === 'center' &&
                                                'text-center',
                                            col.align === 'right' &&
                                                'text-right',
                                            (!col.align ||
                                                col.align === 'left') &&
                                                'text-left',
                                            col.className,
                                        )}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="py-8 text-center text-gray-400"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, index) => (
                                    <tr
                                        key={row.id ?? index}
                                        className={cn(
                                            'border-b last:border-0 hover:bg-gray-50',
                                            rowClassName,
                                        )}
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={cn(
                                                    'px-4 py-3',
                                                    col.align === 'center' &&
                                                        'text-center',
                                                    col.align === 'right' &&
                                                        'text-right',
                                                )}
                                            >
                                                {col.render
                                                    ? col.render(
                                                          row[col.key],
                                                          row,
                                                      )
                                                    : (row[col.key] ?? '-')}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
