import React from 'react';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ICustomSelect, ICustomSelectItem } from '@/types';

const ShadSelect = ({
    id,
    label,
    name,
    value,
    onChange,
    list = [],
    errors = null,
    className = '',
    side = 'bottom',
    placeholder = 'Select an option...',
    addAll = false,
    labelClassName,
    ...props
}: ICustomSelect) => {
    return (
        <div className={cn('flex w-full flex-col gap-2', className)}>
            {label && (
                <Label htmlFor={id ?? name} className={labelClassName}>
                    {label}
                    {props.required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </Label>
            )}

            <Select
                value={String(value) || ''}
                onValueChange={onChange}
                name={name}
                {...props}
            >
                <SelectTrigger
                    className={cn(
                        'w-full',
                        name &&
                            errors?.[name] &&
                            'border-red-500 focus-visible:ring-red-500 aria-invalid:border-red-500',
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent side={side}>
                    {list.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            No options available
                        </div>
                    ) : (
                        <>
                            {addAll && <SelectItem value="all">All</SelectItem>}
                            {list.map((item: ICustomSelectItem) => (
                                <SelectItem
                                    key={item.value}
                                    value={String(item.value)}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>

            {name && errors?.[name] && (
                <span
                    className="px-1 text-sm text-red-600"
                    style={{ marginTop: -8 }}
                >
                    {errors[name]}
                </span>
            )}
        </div>
    );
};

export default ShadSelect;
