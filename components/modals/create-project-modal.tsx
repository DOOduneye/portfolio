import { useState } from 'react';

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
    ProjectWithoutId,
    initialProjectState,
    projectSchema
} from '@/types/project';
import { useProjectStore } from '@/store/modal-store';
import { useCreateProject } from '@/hooks/use-project';
import { ProjectModalContent } from '../project-modal-content';


export const CreateProjectModal = () => {
    const store = useProjectStore();
    const createProject = useCreateProject();
    const [project, setProject] = useState<ProjectWithoutId>(initialProjectState);

    const handleDropdownClose = () => {
        store.onClose();
        setProject(initialProjectState);
    };

    const handleCreateProject = async () => {
        try {
            projectSchema.parse(project);
        } catch (error) {
            toast.error(`Failed to create project`);
            return;
        }

        try {
            const promise = createProject.mutateAsync(project);
            toast.promise(promise, {
                loading: 'Creating project...',
                success: 'Project created successfully!',
                error: 'Failed to create project.',
            });
            handleDropdownClose();
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Failed to create project.');
        }
    }

    return (
        <Dialog open={store.isOpen} onOpenChange={handleDropdownClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle>New Project</DialogTitle>
                    <DialogDescription>
                        Create a new project.
                    </DialogDescription>
                </DialogHeader>
                <ProjectModalContent project={project} setProject={setProject} />
                <Button onClick={handleCreateProject}>
                    Create
                </Button>
            </DialogContent>
        </Dialog>
    );
}