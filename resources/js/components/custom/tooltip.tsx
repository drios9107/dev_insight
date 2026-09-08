import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export function CustomTooltip({ children, text }: { children: React.ReactNode, text: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
