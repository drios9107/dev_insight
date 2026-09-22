import { Label } from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';
import type { IHtmlWithLabel } from '@/types';

const ShadTextarea = ({
    label,
    id,
    name,
    value,
    onChange,
    errors,
    rows = 4,
    ...props
}: IHtmlWithLabel & React.ComponentProps<typeof Textarea>) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <Label htmlFor={id ?? name}>
                    {label}
                    {props.required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </Label>
            )}
            <Textarea
                id={id ?? name}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                rows={rows}
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

export default ShadTextarea;
