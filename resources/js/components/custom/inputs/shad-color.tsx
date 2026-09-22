'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id?: string;
    name: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: Record<string, string>;
}

export function ShadColor({
    label,
    id,
    name,
    value,
    onChange,
    errors,
    className,
    ...props
}: ColorProps) {
    const inputId = id ?? name;

    return (
        <div className="flex w-full flex-col gap-2">
            <Label htmlFor={inputId}>{label}</Label>
            <input
                type="color"
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                className={cn(
                    'h-9 w-16 cursor-pointer rounded-md border border-input bg-transparent p-1 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    className,
                )}
                {...props}
            />
            {name && errors?.[name] && (
                <span className="-mt-1 px-1 text-sm text-red-600">
                    {errors[name]}
                </span>
            )}
        </div>
    );
}
