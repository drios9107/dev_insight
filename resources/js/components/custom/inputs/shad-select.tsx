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
    ...props
}: ICustomSelect) => {

    return (
        <div className="space-y-2 w-full">
            {label && <Label htmlFor={id ?? name}>
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </Label>}

            <Select
                value={value || ''}
                onValueChange={onChange}
                name={name}
                {...props}
            >
                <SelectTrigger
                    className={cn(
                        "w-full",
                        name && errors?.[name] && "border-red-500 focus-visible:ring-red-500 aria-invalid:border-red-500",
                    )}
                >
                    <SelectValue placeholder='Select an option...' />
                </SelectTrigger>
                <SelectContent>
                    {list.length === 0 ? (
                        <div className="py-2 px-4 text-sm text-muted-foreground">
                            No options available
                        </div>
                    ) : (
                        list.map((item: ICustomSelectItem) => (
                            <SelectItem key={item.value} value={String(item.value)}>
                                {item.label}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            {name && errors?.[name] && (
                <p className="mt-1 text-sm text-red-500">{errors?.[name]}</p>
            )}
        </div>
    );
};

export default ShadSelect;