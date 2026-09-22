import { cn } from '@/lib/utils';

const CardSectionWrapper = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) => {
    return (
        <div className={cn(className, 'mb-6 grid w-full grid-cols-1 gap-4')}>
            {children}
        </div>
    );
};

export default CardSectionWrapper;
