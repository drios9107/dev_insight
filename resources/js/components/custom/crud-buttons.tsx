import { List, Pencil, Trash } from "lucide-react"
import { Button } from "../ui/button"

interface ICrudButtonsProps {
    onDetails?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CrudButtons = ({ onDetails, onEdit, onDelete }: ICrudButtonsProps) => {
    return <div className="flex gap-2 justify-center flex-wrap ">
        {onDetails && <Button className="bg-blue-600" onClick={onDetails}><List /></Button>}
        {onEdit && <Button className="bg-yellow-600" onClick={onEdit}><Pencil /></Button>}
        {onDelete && <Button className="bg-red-600" onClick={onDelete}><Trash /></Button>}
    </div>
}

export default CrudButtons;