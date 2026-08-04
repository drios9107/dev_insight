import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ShadInput = ({ label, id, name, value, onChange, ...props }: { label: string, id?: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id ?? name}>{label}</Label>
            <Input id={id ?? name} name={name} value={value} onChange={onChange} {...props} />
        </div>
    )
}

export default ShadInput