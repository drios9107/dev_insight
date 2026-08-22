import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { PaginatedData } from '@/components/custom/table/data-table';

interface IFilters {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number
    page?: number
}

interface IUseTableProps {
    data: PaginatedData,
    filters?: IFilters,
    searchFields?: string[],
    sortFields?: string[],
    perPage?: number,
}

export function useTable({
    data,
    filters: initialFilters = {},
    searchFields = [],
    sortFields = [],
    perPage = 10,
}: IUseTableProps) {
    const [filters, setFilters] = useState({
        search: '',
        sort: initialFilters.sort || sortFields[0] || 'id',
        direction: initialFilters.direction || 'asc',
        per_page: initialFilters.per_page || perPage,
        ...initialFilters,
    });

    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // Actualizar filtros y navegar
    const updateFilters = (newFilters: IFilters) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);

        // 👇 Resetear página si cambian filtros
        if (newFilters.search !== undefined || newFilters.sort !== undefined) {
            updated.page = 1;
        }

        router.get(
            window.location.pathname,
            updated,
            { preserveState: true, preserveScroll: true }
        );
    };

    // Ordenar
    const handleSort = (field: string) => {
        const direction = filters.sort === field && filters.direction === 'asc'
            ? 'desc'
            : 'asc';
        updateFilters({ sort: field, direction });
    };

    // Buscar
    const handleSearch = (value: string) => {
        updateFilters({ search: value });
    };

    // Cambiar página
    const handlePageChange = (page: number) => {
        updateFilters({ page });
    };

    // Cambiar items por página
    const handlePerPageChange = (perPage: number) => {
        updateFilters({ per_page: perPage, page: 1 });
    };

    // Seleccionar filas
    const toggleRowSelection = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const toggleAllRows = () => {
        if (selectedRows.length === data.data?.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.data?.map(item => item.id) || []);
        }
    };

    // Resetear selección
    const clearSelection = () => setSelectedRows([]);

    return {
        filters,
        updateFilters,
        handleSort,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        selectedRows,
        toggleRowSelection,
        toggleAllRows,
        clearSelection,
        sortField: filters.sort,
        sortDirection: filters.direction,
        search: filters.search,
        perPage: filters.per_page,
        data,
    };
}