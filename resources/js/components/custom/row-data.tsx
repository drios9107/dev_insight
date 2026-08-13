interface BaseProps {
    title: string,
    value?: string | number;
    href?: string
    onClick?: () => void
}

// interface UrlProps extends BaseProps {
//     href: string
// }

// type TRowDataProps = BaseProps | UrlProps


const RowData = ({ title, value, href, onClick }: BaseProps) => {
    if (!value) return null

    return <div className="flex gap-1 justify-start items-start">
        <span className="font-semibold" style={{ userSelect: 'none' }}>
            {title}:
        </span>
        {href ?
            <a href={href} className="text-blue-600 font-small">{value}</a> :
            <span onClick={onClick}>{value}</span>}
    </div>
}

export default RowData;