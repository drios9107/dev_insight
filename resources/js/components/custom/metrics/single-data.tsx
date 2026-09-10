interface ISingleData {
    title: string,
    value: string | number,
    color?: 'gray' | 'red' | 'blue' | 'green' | 'yellow' | 'purple'
}

const SingleData = ({ title, value, color = 'gray' }: ISingleData) => {
    return <div className="text-center">
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        <p className="text-xs text-gray-500">{title}</p>
    </div>
}

export default SingleData