import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Loader } from './loader';
import { useMemo } from 'react';

interface DeleteModalProps {
    onClose: () => void;
    onClick: () => void;
    isLoading?: boolean;
    isDisable?: boolean;
}

export function DeleteModal({
    onClose,
    onClick,
    isLoading,
    isDisable = false,
}: DeleteModalProps) {
    const title = useMemo(
        () => (isDisable ? 'Disable' : 'Delete'),
        [isDisable],
    );

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to{' '}
                        {isDisable ? 'disable' : 'delete'} this resource?
                    </DialogDescription>
                </DialogHeader>

                {isLoading && <Loader />}

                <DialogFooter className="flex justify-center">
                    <Button type="button" onClick={onClick}>
                        <Trash />
                        {title}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// background gradient
// bg-gradient-to-b from-[#f7fbff] to-[#eef4ff]
