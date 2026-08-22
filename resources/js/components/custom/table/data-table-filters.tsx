import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TextField, Select, Flex, Box } from '@radix-ui/themes';
import ShadInput from '../inputs/shad-input';
import { ICustomSelectItem } from '@/types';
import { Button } from '@/components/ui/button';

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
        <div className={`flex flex-wrap items-center gap-3 mb-4 ${className}`}>
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <TextField.Root>
                    <ShadInput
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-9 w-full"
                        placeholder="Buscar..."
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
                </TextField.Root>
            </div>

            {/* Filtros dinámicos */}
            {filters.map((filter) => (
                <div key={filter.key} className="w-40">
                    <Select.Root
                        value={filter.value}
                        onValueChange={filter.onChange}
                    >
                        <Select.Trigger placeholder={filter.label} />
                        <Select.Content>
                            <Select.Item value="">Todos</Select.Item>
                            {filter.options.map((option) => (
                                <Select.Item key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
            ))}
        </div>
    );
}