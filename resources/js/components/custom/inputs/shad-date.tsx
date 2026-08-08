import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ShadDateProps {
    label?: string
    name: string
    value?: string | null
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    errors?: Record<string, string>
    required?: boolean
    className?: string
    disabled?: boolean
    min?: string
    max?: string
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
    min,
    max,
}: ShadDateProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <Input
                id={name}
                name={name}
                type="date"
                value={value || ''}
                onChange={onChange}
                className={cn(
                    errors?.[name] && "border-red-500 focus-visible:ring-red-500",
                    className
                )}
                disabled={disabled}
                required={required}
                min={min}
                max={max}
            />
            {name && errors?.[name] && (
                <span className="text-red-600 text-sm px-1" style={{ marginTop: -8 }}>
                    {errors[name]}
                </span>
            )}
        </div>
    )
}