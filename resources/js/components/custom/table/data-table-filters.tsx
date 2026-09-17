import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TextField, Select, Flex, Box } from '@radix-ui/themes';
import ShadInput from '../inputs/shad-input';
import { ICustomSelectItem } from '@/types';
import { Button } from '@/components/ui/button';
import ShadSelect from '../inputs/shad-select';
import ShadSwitch from '../inputs/shad-switch';
import { Label } from '@/components/ui/label';

export interface IFilter {
    key: string;
    value: string;
    onChange: (v: string) => void;
    label: string;
    options: ICustomSelectItem[];
    addAll?: boolean
}

export interface ICheck {
    key: string;
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
}

export interface IDataTableFilters {
    search?: string;
    onSearch: (v: string) => void;
    filters: IFilter[];
    checks: ICheck[];
    className?: string;
}

export function DataTableFilters({
    search,
    onSearch,
    filters = [],
    checks = [],
    className = '',
}: IDataTableFilters) {
    const [localSearch, setLocalSearch] = useState(search || '');

    // Debounce
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
        <div className="flex flex-col gap-3 mb-4 w-full">
            <div className={`flex flex-wrap items-center gap-3 mb-4 w-full ${className}`}>
                {/* Search */}
                <div className="relative flex flex-1 items-center min-w-[200px]">
                    <Search className="absolute left-3 top-2/3 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <ShadInput
                        label='Search'
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-9 w-full"
                        placeholder="Search..."
                        labelClassName='font-normal'
                    />
                    {localSearch && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={handleClear}
                            className="absolute right-1 top-2/3 transform -translate-y-1/2 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Filters */}
                {filters.map((filter) => (
                    <div key={filter.key} className="w-40">
                        <ShadSelect
                            label={filter.label}
                            name={filter.key}
                            value={filter.value}
                            onChange={filter.onChange}
                            list={filter.options}
                            placeholder={filter.label}
                            addAll={filter.addAll}
                            labelClassName='font-normal'
                        />
                    </div>
                ))}
            </div>

            {/* Checks */}
            {checks.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                    {checks.map((i) => (
                        <div key={`${i.key}-${i.value}`} className="flex items-center gap-2">
                            <Label htmlFor={i.key} className="text-sm font-normal cursor-pointer">{i.label}</Label>
                            <ShadSwitch name={i.key} value={i.value} onChange={i.onChange} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}