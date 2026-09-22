const ColData = ({
    title,
    value,
}: {
    title: string;
    value?: string | number;
}) => {
    if (!value) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <span className="font-semibold" style={{ userSelect: 'none' }}>
                {title}:
            </span>
            <span>{value}</span>
        </div>
    );
};

export default ColData;
