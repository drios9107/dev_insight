import { Label } from "@/components/ui/label"
import Textarea from "@/components/ui/textarea"
import { IHtmlWithLabel } from "@/types"

const ShadTextarea = ({ label, id, name, value, onChange, errors, rows = 4, ...props }: IHtmlWithLabel & React.ComponentProps<typeof Textarea>) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <Label htmlFor={id ?? name}>
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </Label>}
            <Textarea
                id={id ?? name}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                rows={rows}
                {...props}
            />
            {name && errors?.[name] && <span className="text-red-600 text-sm px-1" style={{ marginTop: -8 }}>{errors[name]}</span>}
        </div>
    )
}

export default ShadTextarea