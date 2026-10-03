'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import Calendar from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ShadDateProps {
    label?: string;
    name: string;
    value?: string | null;
    onChange: (value: string) => void;
    errors?: Record<string, string>;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}

export function ShadDate({
    label,
    name,
    value,
    onChange,
    errors,
    required = false,
    className,
    disabled = false,
}: ShadDateProps) {
    const [open, setOpen] = useState(false);

    const selected = value ? new Date(value + 'T00:00:00') : undefined;

    const handleSelect = useCallback(
        (date: Date | undefined) => {
            if (!date) {
                onChange('');

                return;
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            onChange(`${year}-${month}-${day}`);
            setOpen(false);
        },
        [onChange],
    );

    return (
        <div className="flex w-full flex-col gap-2">
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={name}
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between text-left font-normal',
                            !selected && 'text-muted-foreground',
                            errors?.[name] &&
                                'border-red-500 focus-visible:ring-red-500',
                            className,
                        )}
                    >
                        {selected
                            ? format(selected, 'dd/MM/yyyy', { locale: es })
                            : 'dd/mm/yyyy'}
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        locale={es}
                    />
                </PopoverContent>
            </Popover>

            {name && errors?.[name] && (
                <span className="px-1 text-sm text-red-600">
                    {errors[name]}
                </span>
            )}
        </div>
    );
}
