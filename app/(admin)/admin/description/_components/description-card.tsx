'use client';

import {Description} from '@/types/description';
import {useEditDescriptionStore} from '@/hooks/use-modal';

import {AdminDropdown} from '../../_components/admin-dropdown';

export const DescriptionCard = (description: Description) => {
  const editDescriptionStore = useEditDescriptionStore();

  const handleEditClick = () => {
    editDescriptionStore.setData(description);
    editDescriptionStore.onOpen();
  };

  return (
    <div
      className={
        'flex flex-row p-5 gap-x-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900'
      }
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">{description?.title}</h1>
        <p className="mt-4 text-sm font-normal dark:text-muted-foreground text-gray-500">
          {description?.description}
        </p>
      </div>
      <AdminDropdown onEdit={handleEditClick} />
    </div>
  );
};
