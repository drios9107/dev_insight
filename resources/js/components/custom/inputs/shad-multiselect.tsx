import { useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import ShadSelect from './shad-select';
import { Badge } from '@/components/ui/badge';
import { ICustomSelectItem } from '@/types';

interface IShadMultiSelect {
    label?: string;
    name: string;
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    list: ICustomSelectItem[];
    errors?: Record<string, string>;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

const ShadMultiSelect = ({
    label,
    name,
    value = [],
    onChange,
    list = [],
    errors = {},
    placeholder = 'Select options...',
    disabled = false,
    required = false,
}: IShadMultiSelect) => {
    const normalizeValue = useCallback((v: string | number): string | number => {
        return isNaN(Number(v)) ? v : Number(v);
    }, []);

    const handleSelect = useCallback(
        (selected: string) => {
            const normalized = normalizeValue(selected);

            if (!value.includes(normalized)) {
                onChange([...value, normalized]);
            }
        },
        [value, onChange, normalizeValue]
    );

    const handleRemove = useCallback(
        (item: string | number) => {
            onChange(value.filter((v) => v !== item));
        },
        [value, onChange]
    );

    const selectedItems = useMemo(
        () =>
            value
                .map((v) => list.find((item) => String(item.value) === String(v)))
                .filter(Boolean),
        [value, list]
    );

    const availableItems = useMemo(
        () =>
            list.map((item) => ({
                ...item,
                disabled: value.includes(normalizeValue(item.value)),
            })),
        [list, value, normalizeValue]
    );

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-gray-50">
                    {selectedItems.map((item) => (
                        <Badge
                            key={item!.value}
                            variant="secondary"
                            className="gap-1 pr-1"
                        >
                            {item!.label}
                            <button
                                type="button"
                                onClick={() => handleRemove(item!.value)}
                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                disabled={disabled}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <ShadSelect
                name={name}
                value=""
                onChange={handleSelect}
                list={availableItems}
                placeholder={
                    selectedItems.length > 0
                        ? `${selectedItems.length} selected — add more...`
                        : placeholder
                }
                disabled={disabled}
                errors={errors}
            />
        </div>
    );
};

export default ShadMultiSelect;