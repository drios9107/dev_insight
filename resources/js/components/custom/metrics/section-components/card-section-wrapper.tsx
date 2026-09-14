import { cn } from "@/lib/utils"

const CardSectionWrapper = ({ children, className }: { children: React.ReactNode, className: string }) => {
    return <div className={cn(className, "grid grid-cols-1 gap-4 mb-6 w-full")} >
        {children}
    </div >
}

export default CardSectionWrapper