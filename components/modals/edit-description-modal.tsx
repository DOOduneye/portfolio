import {useEffect, useState} from 'react';

import {toast} from 'sonner';

import {useEditDescriptionStore} from '@/hooks/use-modal';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {useUpdateDescription} from '@/hooks/use-description';
import {DESCRIPTION_ID, descriptionSchema} from '@/types/description';
import {DescriptionModalContent} from '../description-modal-content';

export const EditDescriptionModal = () => {
  const store = useEditDescriptionStore();
  const updateDescription = useUpdateDescription();
  const [description, setDescription] = useState(store.data);

  useEffect(() => {
    setDescription(store.data);
  }, [store.data]);

  const handleDropdownClose = () => {
    store.onClose();
  };

  const handleEditDescription = async () => {
    try {
      descriptionSchema.parse(description);
    } catch (error) {
      console.error('Error editing description:', error);
      toast.error('Failed to edit description');
      return;
    }

    try {
      const promise = updateDescription.mutateAsync({
        data: description,
        id: DESCRIPTION_ID,
      });
      toast.promise(promise, {
        loading: 'Editing description...',
        success: 'Description edited successfully!',
        error: 'Failed to edit description.',
      });
      handleDropdownClose();
    } catch (error) {
      console.error('Error editing description:', error);
      toast.error('Failed to edit description.');
    }
  };

  return (
    <Dialog open={store.isOpen} onOpenChange={handleDropdownClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Edit Description</DialogTitle>
          <DialogDescription>Edit description details</DialogDescription>
        </DialogHeader>
        <DescriptionModalContent
          description={description}
          setDescription={setDescription}
        />
        <Button onClick={handleEditDescription}>Edit</Button>
      </DialogContent>
    </Dialog>
  );
};
