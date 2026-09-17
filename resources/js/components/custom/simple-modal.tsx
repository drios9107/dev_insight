import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader } from "./loader"
import { Save } from "lucide-react"
import { useMemo } from "react"

interface SimpleModalProps {
    title?: string
    description?: string
    onClose: () => void
    onClick: () => void
    children: React.ReactNode
    isLoading?: boolean
    confirmText?: string
    height?: string | number | null
}

export function SimpleModal({ title = "", description, onClose, children, isLoading, onClick, confirmText = 'Save', height = 600 }: SimpleModalProps) {
    const getHeight = useMemo(() => height !== null ? { height } : {}, [height])

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg overflow-y-auto" style={getHeight}>
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        {title}
                    </DialogTitle>
                    {description && <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>}
                </DialogHeader>

                {children}

                {isLoading && <Loader />}

                <DialogFooter className="flex justify-center">
                    <Button type="button" onClick={onClick}><Save />{confirmText}</Button>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


// background gradient
// bg-gradient-to-b from-[#f7fbff] to-[#eef4ff]