import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/components/ui/drawer';
import { ReactNode } from 'react';

interface IShadDrawer {
    title?: string;
    description?: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    children: ReactNode;
}

const ShadDrawer = ({
    title,
    description,
    isOpen,
    setIsOpen,
    children,
}: IShadDrawer) => {
    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction='right'>
            <DrawerContent className="w-full sm:w-[600px] flex flex-col">
                <DrawerHeader className='pb-0'>
                    {title && <DrawerTitle className='w-full text-center'>{title}</DrawerTitle>}
                    {description && (
                        <DrawerDescription>{description}</DrawerDescription>
                    )}
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ShadDrawer;