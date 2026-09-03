import { Plus } from "lucide-react"
import { Button } from "../ui/button"

interface IHeader {
    title: string,
    onClick?: () => void
}

const Header = ({ title = '', onClick }: IHeader) => {
    return <div className="flex justify-between items-center">
        <h1 className="p-6">{title}</h1>
        {onClick && <Button className="bg-green-600 mx-6" onClick={onClick}><Plus /></Button>}
    </div>
}

export default Header