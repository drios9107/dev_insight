import ShadSelect from '@/components/custom/inputs/shad-select';
import { Label } from '@/components/ui/label';
import type { ICustomSelectItem } from '@/types';

export interface ITabSelector {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    list: ICustomSelectItem[];
}

interface TabSelectorProps {
    selector: ITabSelector;
}

export default function TabSelector({ selector }: TabSelectorProps) {
    return (
        <div className="flex w-60 items-center gap-2">
            <Label htmlFor={selector.id} className="font-normal">
                {selector.label}
            </Label>
            <ShadSelect
                name={selector.id}
                value={selector.value}
                onChange={selector.onChange}
                list={selector.list}
            />
        </div>
    );
}
