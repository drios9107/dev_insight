import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IHtmlWithLabel } from "@/types"

const ShadInput = ({ label, id, name, value, onChange, errors, ...props }: IHtmlWithLabel) => {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id ?? name}>{label}</Label>
            <Input id={id ?? name} name={name} value={value} onChange={onChange} {...props} />
            {name && errors?.[name] && <span className="text-red-600 text-sm px-1" style={{ marginTop: -8 }}>{errors[name]}</span>}
        </div>
    )
}

export default ShadInput