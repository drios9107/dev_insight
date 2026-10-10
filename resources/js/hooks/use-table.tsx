import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { PaginatedData } from '@/components/custom/table/data-table';

interface IFilters {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

interface IUseTableProps {
    data: PaginatedData;
    filters?: IFilters;
    sortFields?: string[];
    perPage?: number;
}

export function useTable({
    data,
    filters: initialFilters = {},
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
    const updateFilters = useCallback(
        (newFilters: IFilters) => {
            const updated = { ...filters, ...newFilters };
            setFilters(updated);

            // Reset page
            if (
                newFilters.search !== undefined ||
                newFilters.sort !== undefined
            ) {
                updated.page = 1;
            }

            router.get(window.location.pathname, updated, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [filters],
    );

    // Sort
    const handleSort = useCallback(
        (field: string) => {
            const direction =
                filters.sort === field && filters.direction === 'asc'
                    ? 'desc'
                    : 'asc';
            updateFilters({ sort: field, direction });
        },
        [filters.sort, filters.direction, updateFilters],
    );

    // Search
    const handleSearch = useCallback(
        (value: string) => {
            updateFilters({ search: value });
        },
        [updateFilters],
    );

    // Change page
    const handlePageChange = useCallback(
        (page: number) => {
            updateFilters({ page });
        },
        [updateFilters],
    );

    // Change items per page
    const handlePerPageChange = useCallback(
        (perPage: number) => {
            updateFilters({ per_page: perPage, page: 1 });
        },
        [updateFilters],
    );

    // Select single row
    const toggleRowSelection = useCallback((id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((rowId) => rowId !== id)
                : [...prev, id],
        );
    }, []);

    // Select/deselect all rows on the current page
    const toggleAllRows = useCallback(
        (checked?: boolean) => {
            const currentPageIds = data.data?.map((item) => item.id) ?? [];

            setSelectedRows((prev) => {
                const allSelected =
                    currentPageIds.length > 0 &&
                    currentPageIds.every((id) => prev.includes(id));

                const shouldSelectAll = checked ?? !allSelected;

                return shouldSelectAll ? currentPageIds : [];
            });
        },
        [data.data],
    );

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedRows([]);
    }, []);

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
