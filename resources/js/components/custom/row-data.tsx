interface BaseProps {
    title: string;
    value?: string | number;
    href?: string;
    onClick?: () => void;
}

// interface UrlProps extends BaseProps {
//     href: string
// }

// type TRowDataProps = BaseProps | UrlProps

const RowData = ({ title, value, href, onClick }: BaseProps) => {
    if (!value) {
        return null;
    }

    return (
        <div className="flex items-start justify-start gap-1">
            <span className="font-semibold" style={{ userSelect: 'none' }}>
                {title}:
            </span>
            {href ? (
                <a
                    href={href}
                    className="font-small text-blue-600"
                    style={{ lineBreak: 'anywhere' }}
                >
                    {value}
                </a>
            ) : (
                <span onClick={onClick}>{value}</span>
            )}
        </div>
    );
};

export default RowData;
