// resources/js/components/metrics/SectionTitle.tsx

interface SectionTitleProps {
    title: string;
    className?: string;
}

export function SectionTitle({ title, className = '' }: SectionTitleProps) {
    return (
        <h2 className={`text-lg font-semibold text-gray-800 mb-4 w-full block ${className}`}>
            {title}
        </h2>
    );
}