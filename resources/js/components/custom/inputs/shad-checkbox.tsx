'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Label } from '@radix-ui/react-label';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
    label?: string;
    id?: string;
    name: string;
    extraclasses?: string;
    value: boolean;
    onChange: (value: boolean) => void;
    errors?: Record<string, string>;
    labelClassName?: string;
    disabled?: boolean;
}

const ShadCheckbox = ({
    label,
    id,
    name,
    value,
    onChange,
    extraclasses,
    errors,
    labelClassName,
    ...props
}: CheckboxProps) => {
    const inputId = id ?? name;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center space-x-2">
                <CheckboxPrimitive.Root
                    id={inputId}
                    name={name}
                    className={cn(
                        'peer h-4 w-4 shrink-0 cursor-pointer rounded-sm border border-primary shadow',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'data-[state=checked]:border-0 data-[state=checked]:bg-blue-500 data-[state=checked]:text-primary-foreground',
                        extraclasses,
                    )}
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked === true)}
                    {...props}
                >
                    <CheckboxPrimitive.Indicator
                        className={cn(
                            'flex items-center justify-center text-current',
                        )}
                    >
                        <Check className="h-3.5 w-3.5" />
                    </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                {label && (
                    <Label
                        htmlFor={inputId}
                        className={cn('cursor-pointer text-sm', labelClassName)}
                    >
                        {label}
                    </Label>
                )}
            </div>
            {name && errors?.[name] && (
                <span className="px-1 text-sm text-red-600">
                    {errors[name]}
                </span>
            )}
        </div>
    );
};

export default ShadCheckbox;
