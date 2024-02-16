import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { useUpdateExperience } from '@/hooks/use-experience';
import { experienceSchema } from '@/types/experience';
import { useEditExperienceStore } from '@/hooks/use-modal';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExperienceModalContent } from '@/components/experience-modal-content';
import { ZodError } from 'zod';


export const EditExperienceModal = () => {
    const store = useEditExperienceStore();
    const updateExperience = useUpdateExperience();
    const [experience, setExperience] = useState(store.data);

    useEffect(() => {
        setExperience(store.data);
    }, [store.data]);

    const handleDropdownClose = () => {
        store.onClose();
    };

    const handleEditExperience = async () => {
        try {
            experienceSchema.parse(experience);
        } catch (error) {
            console.error('Error editing experience:', error);
            toast.error("Failed to edit experience");
            return;
        }

        try {
            const promise = updateExperience.mutateAsync({ data: experience, id: experience.id });
            toast.promise(promise, {
                loading: 'Editing experience...',
                success: 'Experience edited successfully!',
                error: 'Failed to edit experience.',
            });
            handleDropdownClose();
        } catch (error) {
            console.error('Error editing experience:', error);
            toast.error('Failed to edit experience.');
        }
    }

    return (
        <Dialog open={store.isOpen} onOpenChange={handleDropdownClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle>Edit Experience</DialogTitle>
                    <DialogDescription>
                        Edit experience details
                    </DialogDescription>
                </DialogHeader>
                <ExperienceModalContent experience={experience} setExperience={setExperience} />
                <Button onClick={handleEditExperience}>
                    Edit
                </Button>
            </DialogContent>
        </Dialog>
    );
};