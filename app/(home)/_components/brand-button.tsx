import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"

interface BrandButtonProps {
    icon: LucideIcon
    href?: string
    tip: string
}

export const BrandButton = ({
    icon: Icon,
    href,
    tip,
}: BrandButtonProps) => {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <a className="flex items-center justify-center transition-colors duration-200 hover:text-gray-400 dark:hover:text-gray-800" href={href}>
                        <Icon />
                    </a>
                </TooltipTrigger>
                <TooltipContent>
                    <span className="text-sm font-normal text-gray-900 dark:text-gray-200">{tip}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}