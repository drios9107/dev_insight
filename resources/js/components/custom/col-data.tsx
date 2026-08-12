
const ColData = ({ title, value }: {
    title: string,
    value?: string | number;
}) => {
    return <div className="flex flex-col gap-1 justify-center items-center">
        <span className="font-semibold">
            {title}:
        </span>
        <span>
            {value}
        </span>
    </div>
}

export default ColData;