import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TextField, Select, Flex, Box } from '@radix-ui/themes';
import ShadInput from '../inputs/shad-input';
import { ICustomSelectItem } from '@/types';
import { Button } from '@/components/ui/button';
import ShadSelect from '../inputs/shad-select';

export interface IFilter {
    key: string;
    value: string;
    onChange: (v: string) => void;
    label: string;
    options: ICustomSelectItem[];
}

export interface IDataTableFilters {
    search?: string;
    onSearch: (v: string) => void;
    filters: IFilter[];
    className?: string;
}

export function DataTableFilters({
    search,
    onSearch,
    filters = [],
    className = '',
}: IDataTableFilters) {
    const [localSearch, setLocalSearch] = useState(search || '');

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== search) {
                onSearch(localSearch);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch]);

    const handleClear = () => {
        setLocalSearch('');
        onSearch('');
    };

    return (
        <div className={`flex flex-wrap items-center gap-3 mb-4 w-full ${className}`}>
            {/* Búsqueda */}
            <div className="relative flex flex-1 items-center min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ShadInput
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-9 w-full"
                    placeholder="Search..."
                />
                {localSearch && (
                    <Button
                        variant="link"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Filtros dinámicos */}
            {filters.map((filter) => (
                <div key={filter.key} className="w-40">
                    <ShadSelect
                        name={filter.key}
                        value={filter.value}
                        onChange={filter.onChange}
                        list={filter.options}
                        placeholder={filter.label}
                    />
                </div>
            ))}
        </div>
    );
}