import { List, Pencil, Trash } from "lucide-react"
import { Button } from "../ui/button"

// @todo: fix ts annotation {onDetails:something}
const CrudButtons = (props: any) => {
    return <div className="flex gap-2 justify-center flex-wrap ">
        {props.onDetails && <Button className="bg-blue-600" onClick={props.onDetails}><List /></Button>}
        {props.onEdit && <Button className="bg-yellow-600" onClick={props.onEdit}><Pencil /></Button>}
        {props.onDelete && <Button className="bg-red-600" onClick={props.onDelete}><Trash /></Button>}
    </div>
}

export default CrudButtons;