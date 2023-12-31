import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';

import {
    Project,
    projectSchema
} from '@/types/project';
import { useUpdateProject } from '@/hooks/use-project';
import { useEditExperienceStore, useEditProjectStore } from '@/store/modal-store';
import { useUpdateExperience } from '@/hooks/use-experience';
import { experienceSchema } from '@/types/experience';
import { ExperienceModalContent } from '../experience-modal-content';


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
            toast.error(`Failed to edit experience`);
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