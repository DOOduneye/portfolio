import { MoreVertical } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface AdminDropdownProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const AdminDropdown = ({ onEdit, onDelete }: AdminDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className='flex flex-row justify-between gap-x-4 items-center border-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'>
                    <MoreVertical className='w-4 h-4' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <DropdownMenuLabel onClick={onEdit}>Edit</DropdownMenuLabel>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <ConfirmModal onConfirm={onDelete}>
                        <DropdownMenuLabel>Delete</DropdownMenuLabel>
                    </ConfirmModal>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}