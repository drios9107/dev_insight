import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IHtmlWithLabel } from '@/types';

const ShadInput = ({
    label,
    id,
    name,
    value,
    onChange,
    errors,
    labelClassName,
    ...props
}: IHtmlWithLabel) => {
    return (
        <div className="flex w-full flex-col gap-2">
            {label && (
                <Label htmlFor={id ?? name} className={labelClassName}>
                    {label}
                    {props.required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </Label>
            )}
            <Input
                id={id ?? name}
                name={name}
                value={value}
                onChange={onChange}
                {...props}
            />
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

export default ShadInput;
