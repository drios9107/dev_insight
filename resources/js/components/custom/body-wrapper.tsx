
const BodyWrapper = ({ children }: {
    children?: any;
}) => {
    return <div className="flex gap-6 px-6 flex-wrap justify-start">
        {children}
    </div>
}

export default BodyWrapper;