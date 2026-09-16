import { Table, Box, Text, Button, ThemeContext, useThemeContext } from '@radix-ui/themes';
import { ColumnHeader } from './column-header';
import { DataTableFilters, ICheck, IFilter } from './data-table-filters';
import { DataTablePagination } from './data-table-pagination';
import { TableActions } from './table-actions';
import { useTable } from '../../../hooks/use-table';
import { useMemo } from 'react';

export interface BaseEntity {
    id: number;
    [key: string]: any;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginationLink {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginatedData {
    data: BaseEntity[];
    links: PaginationLink;
    meta: PaginationMeta;
}

export interface IColumn<T = any> {
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: T) => React.ReactNode;
    width?: string | number;
    className?: string;
    hideOnMobile?: boolean;
}

interface IDataTableProps {
    data: PaginatedData;
    columns: IColumn[];
    filters?: IFilter[];
    checks?: ICheck[];
    searchFields?: string[];
    initialFilters?: Record<string, any>;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onBulkDelete?: (ids: (number | string)[]) => void;
    onSync?: (item: any) => void;
    actions?: boolean;
    selectable?: boolean;
    className?: string;
    emptyMessage?: string;
    getRowId?: (item: string) => string | number;
    hideOnMobile?: boolean;
}

export function DataTable({
    data,
    columns,
    filters = [],
    checks = [],
    searchFields = [],
    // initialFilters = {},
    onEdit,
    onDelete,
    onBulkDelete,
    onSync,
    selectable = false,
    className = '',
}: IDataTableProps) {
    const theme = useThemeContext()
    const {
        handleSort,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        selectedRows,
        toggleRowSelection,
        toggleAllRows,
        sortField,
        sortDirection,
        search,
    } = useTable({
        data,
        searchFields,
        sortFields: columns.filter(i => i.sortable).map(i => i.key),
    });

    const items = useMemo(() => data?.data || [], [data?.data]);

    const hasActions = useMemo(() => onEdit || onDelete || onSync || onBulkDelete, [onEdit, onDelete, onSync, onBulkDelete])

    return (
        <ThemeContext value={theme}>
            {/* Filtros */}
            <DataTableFilters
                search={search}
                onSearch={handleSearch}
                filters={filters}
                checks={checks}
            />

            {/* Barra de acciones superiores */}
            {selectedRows.length > 0 && onBulkDelete && (
                <div className="flex items-center gap-3 mb-3 p-2 bg-blue-50 rounded">
                    <Text size="2">
                        {selectedRows.length} seleccionados
                    </Text>
                    <Button
                        variant="solid"
                        color="red"
                        size="1"
                        onClick={() => onBulkDelete(selectedRows)}
                    >
                        Eliminar seleccionados
                    </Button>
                    <Button
                        variant="ghost"
                        size="1"
                        onClick={() => toggleAllRows()}
                    >
                        Limpiar selección
                    </Button>
                </div>
            )}

            {/* Tabla */}
            <Box className="overflow-x-auto border rounded-lg w-full datatable-container">
                <Table.Root variant="surface" size="2">
                    <Table.Header>
                        <Table.Row>
                            {/* Selector masivo */}
                            {selectable && (
                                <Table.ColumnHeaderCell className="w-8">
                                    <input
                                        type="checkbox"
                                        checked={items.length > 0 && selectedRows.length === items.length}
                                        onChange={toggleAllRows}
                                        className="rounded border-gray-300"
                                    />
                                </Table.ColumnHeaderCell>
                            )}

                            {/* Columnas */}
                            {columns.map((col) => (
                                <ColumnHeader
                                    key={col.key}
                                    field={col.key}
                                    label={col.label}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={col.sortable !== false ? handleSort : undefined}
                                    align={col.align || 'left'}
                                    className={col.className}
                                />
                            ))}

                            {/* Acciones */}
                            {hasActions && (
                                <Table.ColumnHeaderCell className="w-30 text-center bg-blue-100 text-gray-600">
                                    Acciones
                                </Table.ColumnHeaderCell>
                            )}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {items.length === 0 ? (
                            <Table.Row>
                                <Table.Cell
                                    colSpan={columns.length + (hasActions ? 1 : 0) + (selectable ? 1 : 0)}
                                    className="text-center py-8"
                                >
                                    <Text color="gray" size="2">
                                        No hay datos para mostrar
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            items.map((item) => (
                                <Table.Row key={item.id} className="h-[52px] hover:bg-gray-100 transition-colors duration-150">
                                    {/* Checkbox de selección */}
                                    {selectable && (
                                        <Table.Cell className='px-4 py-3'>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => toggleRowSelection(item.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </Table.Cell>
                                    )}

                                    {/* Datos de la fila */}
                                    {columns.map((col) => (
                                        <Table.Cell key={col.key} align={col.align || 'left'} className='px-4'>
                                            {col.render
                                                ? col.render(item[col.key], item)
                                                : item[col.key] ?? '-'}
                                        </Table.Cell>
                                    ))}

                                    {/* Acciones */}
                                    {hasActions && (
                                        <Table.Cell align="right" className='px-4 py-3'>
                                            <TableActions
                                                item={item}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onSync={onSync}
                                                isGithubItem={item.github_id !== undefined}
                                            />
                                        </Table.Cell>
                                    )}
                                </Table.Row>
                            ))
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>

            {/* Paginación */}
            <DataTablePagination
                currentPage={data?.meta?.current_page || 1}
                total={data?.meta?.total}
                perPage={data?.meta?.per_page}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
            />
        </ThemeContext>
    );
}