import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ICustomSelectItem } from '@/types';
import ShadInput from '../inputs/shad-input';
import ShadSelect from '../inputs/shad-select';
import ShadSwitch from '../inputs/shad-switch';

export interface IFilter {
    key: string;
    value: string;
    onChange: (v: string) => void;
    label: string;
    options: ICustomSelectItem[];
    addAll?: boolean;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearch]);

    const handleClear = () => {
        setLocalSearch('');
        onSearch('');
    };

    return (
        <div className="mb-4 flex w-full flex-col gap-3">
            <div
                className={`mb-4 flex w-full flex-wrap items-center gap-3 ${className}`}
            >
                {/* Search */}
                <div className="relative flex min-w-[200px] flex-1 items-center">
                    <Search className="absolute top-2/3 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <ShadInput
                        label="Search"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full pl-9"
                        placeholder="Search..."
                        labelClassName="font-normal"
                    />
                    {localSearch && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={handleClear}
                            className="absolute top-2/3 right-1 -translate-y-1/2 transform cursor-pointer"
                        >
                            <X className="h-4 w-4" />
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
                            labelClassName="font-normal"
                        />
                    </div>
                ))}
            </div>

            {/* Checks */}
            {checks.length > 0 && (
                <div className="flex w-full flex-wrap items-center gap-4">
                    {checks.map((i) => (
                        <div
                            key={`${i.key}-${i.value}`}
                            className="flex items-center gap-2"
                        >
                            <Label
                                htmlFor={i.key}
                                className="cursor-pointer text-sm font-normal"
                            >
                                {i.label}
                            </Label>
                            <ShadSwitch
                                name={i.key}
                                value={i.value}
                                onChange={i.onChange}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
