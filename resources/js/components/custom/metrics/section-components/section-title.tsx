// resources/js/components/metrics/SectionTitle.tsx

interface SectionTitleProps {
    title: string;
    className?: string;
}

export function SectionTitle({ title, className = '' }: SectionTitleProps) {
    return (
        <h2
            className={`mb-4 block w-full text-lg font-semibold text-gray-800 ${className}`}
        >
            {title}
        </h2>
    );
}
