import { Plus } from "lucide-react"
import { Button } from "../ui/button"

interface IHeader {
    title: string,
    onClick?: () => void,
    children?: React.ReactNode
}

const Header = ({ title = '', onClick, children }: IHeader) => {
    return (
        <div className="flex justify-between items-center m-6">
            <h1>{title}</h1>
            {onClick && <Button variant="outline" className="text-green-600" onClick={onClick}><Plus className="w-4 h-4" /></Button>}
            {children}
        </div>
    )
}

export default Header