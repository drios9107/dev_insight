import { cn } from '@/lib/utils';

const CardSectionWrapper = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) => {
    return (
        <div className={cn('mb-6 grid w-full grid-cols-1 gap-4', className)}>
            {children}
        </div>
    );
};

export default CardSectionWrapper;
