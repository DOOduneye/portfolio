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
import { useEditProjectStore } from '@/store/modal-store';
import { ProjectModalContent } from '@/components/project-modal-content';


export const EditProjectModal = () => {
    const store = useEditProjectStore();
    const updateProject = useUpdateProject();
    const [project, setProject] = useState(store.data);

    useEffect(() => {
        setProject(store.data);
    }, [store.data]);

    const handleDropdownClose = () => {
        store.onClose();
    };

    const handleEditProject = async () => {
        try {
            projectSchema.parse(project);
        } catch (error) {
            toast.error(`Failed to edit project`);
            return;
        }

        try {
            const promise = updateProject.mutateAsync({ data: project, id: project.id });
            toast.promise(promise, {
                loading: 'Editing project...',
                success: 'Project edited successfully!',
                error: 'Failed to edit project.',
            });
            handleDropdownClose();
        } catch (error) {
            console.error('Error editing project:', error);
            toast.error('Failed to edit project.');
        }
    }

    return (
        <Dialog open={store.isOpen} onOpenChange={handleDropdownClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                        Edit project details
                    </DialogDescription>
                </DialogHeader>
                <ProjectModalContent project={project} setProject={setProject} />
                <Button onClick={handleEditProject}>
                    Edit
                </Button>
            </DialogContent>
        </Dialog>
    );
};