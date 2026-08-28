import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ICustomSelect, ICustomSelectItem } from '@/types';
import { Label } from '@/components/ui/label';

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
    ...props
}: ICustomSelect) => {
    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            {label && (
                <Label htmlFor={id ?? name}>
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
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
                        "w-full",
                        name &&
                        errors?.[name] &&
                        "border-red-500 focus-visible:ring-red-500 aria-invalid:border-red-500"
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent side={side}>
                    {list.length === 0 ?
                        <div className="py-2 px-4 text-sm text-muted-foreground">
                            No options available
                        </div>
                        :
                        <>
                            {addAll && <SelectItem value="">
                                All
                            </SelectItem>}
                            {list.map((item: ICustomSelectItem) => (
                                <SelectItem key={item.value} value={String(item.value)}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </>
                    }
                </SelectContent>
            </Select>

            {name && errors?.[name] && (
                <span
                    className="text-red-600 text-sm px-1"
                    style={{ marginTop: -8 }}
                >
                    {errors[name]}
                </span>
            )}
        </div>
    );
};

export default ShadSelect;
