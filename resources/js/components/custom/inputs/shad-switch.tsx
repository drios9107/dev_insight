'use client';

import { Label } from '@radix-ui/react-label';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
    label?: string;
    id?: string;
    name: string;
    extraclasses?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

const ShadSwitch = ({
    label,
    id,
    name,
    value,
    onChange,
    extraclasses,
    ...props
}: SwitchProps) => {
    const inputId = id ?? name;

    return (
        <div className="flex items-center space-x-2">
            <SwitchPrimitive.Root
                id={inputId}
                name={name}
                className={cn(
                    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
                    extraclasses,
                )}
                checked={value}
                onCheckedChange={onChange}
                {...props}
            >
                <SwitchPrimitive.Thumb
                    className={cn(
                        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                    )}
                />
            </SwitchPrimitive.Root>
            {label && <Label htmlFor={id ?? name}>{label}</Label>}
        </div>
    );
};

export default ShadSwitch;
