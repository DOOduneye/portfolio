import {MoreVertical} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ConfirmModal} from '@/components/modals/confirm-modal';

interface AdminDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AdminDropdown = ({onEdit, onDelete}: AdminDropdownProps) => {
  return (
    <>
      {onEdit || onDelete ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="self-center h-10">
            <div className="flex flex-row items-center justify-between p-3 border-2 rounded-md gap-x-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreVertical className="w-4 h-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem>
                <DropdownMenuLabel onClick={onEdit}>Edit</DropdownMenuLabel>
              </DropdownMenuItem>
            )}

            {onEdit && onDelete ? <DropdownMenuSeparator /> : null}

            {onDelete && (
              <DropdownMenuItem>
                <ConfirmModal onConfirm={onDelete}>
                  <DropdownMenuLabel>Delete</DropdownMenuLabel>
                </ConfirmModal>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
};
