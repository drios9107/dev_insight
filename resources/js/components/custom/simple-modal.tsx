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

interface SimpleModalProps {
    title?: string
    description?: string
    onClose: () => void
    children: React.ReactNode
    isLoading?: boolean
}

export function SimpleModal({ title = "", description, onClose, children, isLoading }: SimpleModalProps) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
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
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


// background gradient
// bg-gradient-to-b from-[#f7fbff] to-[#eef4ff]