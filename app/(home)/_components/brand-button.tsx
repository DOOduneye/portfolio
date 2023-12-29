import { LucideIcon } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

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
                    <Button variant="outline" size="icon" className=" border-0 bg-transparent dark:bg-transparent" asChild>
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            <Icon />
                        </a>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <span className="text-sm font-normal text-gray-900 dark:text-gray-200">{tip}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}