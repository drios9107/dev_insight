import { Loader2 } from "lucide-react"

export function Loader() {
    return (
        <div className="absolute flex items-center justify-center min-h-screen w-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    )
}