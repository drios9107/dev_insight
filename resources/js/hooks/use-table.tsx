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

    // Update filters and navigate
    const updateFilters = (newFilters: IFilters) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);

        // Reset page
        if (newFilters.search !== undefined || newFilters.sort !== undefined) {
            updated.page = 1;
        }

        router.get(
            window.location.pathname,
            updated,
            { preserveState: true, preserveScroll: true }
        );
    };

    // Sort
    const handleSort = (field: string) => {
        const direction = filters.sort === field && filters.direction === 'asc'
            ? 'desc'
            : 'asc';
        updateFilters({ sort: field, direction });
    };

    // Search
    const handleSearch = (value: string) => {
        updateFilters({ search: value });
    };

    // Change page
    const handlePageChange = (page: number) => {
        updateFilters({ page });
    };

    // Change items per page
    const handlePerPageChange = (perPage: number) => {
        updateFilters({ per_page: perPage, page: 1 });
    };

    // Select rows
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

    // Reset selection
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