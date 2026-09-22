const BodyWrapper = ({ children }: { children?: any }) => {
    return (
        <div className="flex flex-wrap justify-start gap-6 px-6 pb-6">
            {children}
        </div>
    );
};

export default BodyWrapper;
