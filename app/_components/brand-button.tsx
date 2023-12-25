import { LucideIcon } from "lucide-react"

interface BrandButtonProps {
    icon: LucideIcon
    href?: string
    className?: string
}
export const BrandButton = ({
    icon: Icon,
    href,
    className,
}: BrandButtonProps) => {

    return (
        <a className="flex items-center justify-center transition-colors duration-200 hover:text-gray-400 dark:hover:text-gray-800" href={href}>
            <Icon />
        </a>
    )
}