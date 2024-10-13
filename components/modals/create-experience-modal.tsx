import {useState} from 'react';

import {toast} from 'sonner';

import {
  ExperienceWithoutId,
  experienceSchema,
  initialExperienceState,
} from '@/types/experience';
import {useCreateExperience} from '@/hooks/use-experience';
import {useExperienceStore} from '@/hooks/use-modal';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {ExperienceModalContent} from '@/components/experience-modal-content';

export const CreateExperienceModal = () => {
  const store = useExperienceStore();
  const createExperience = useCreateExperience();
  const [experience, setExperience] = useState<ExperienceWithoutId>(
    initialExperienceState
  );

  const handleDropdownClose = () => {
    store.onClose();
    setExperience(initialExperienceState);
  };

  const handleCreateExperience = async () => {
    try {
      experienceSchema.parse(experience);
    } catch (error) {
      toast.error('Failed to create experience');
      return;
    }

    try {
      const promise = createExperience.mutateAsync(experience);
      toast.promise(promise, {
        loading: 'Creating experience...',
        success: 'Experience created successfully!',
        error: 'Failed to create experience.',
      });
      handleDropdownClose();
    } catch (error) {
      console.error('Error creating experience:', error);
      toast.error('Failed to create experience.');
    }
  };

  return (
    <Dialog open={store.isOpen} onOpenChange={handleDropdownClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle>New Experience</DialogTitle>
          <DialogDescription>Create a new experience.</DialogDescription>
        </DialogHeader>
        <ExperienceModalContent
          experience={experience}
          setExperience={setExperience}
        />
        <Button onClick={handleCreateExperience}>Create</Button>
      </DialogContent>
    </Dialog>
  );
};
