
import { useState } from 'react';

import { z } from 'zod';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';

import { Project, ProjectWithoutId } from '@/types/project';
import { useProjectStore, useUpdateProject } from '@/hooks/use-project';
import { DatePicker } from '@/app/(admin)/admin/_components/date-picker';


export const EditProjectModal = ({ initialProject }: { initialProject: Project }) => {
    const projectStore = useProjectStore();
    const updateProject = useUpdateProject();

    const [project, setProject] = useState<Project>(initialProject);

    const handleDropdownClose = () => {
        projectStore.onClose();
        // Clear all data when the dropdown closes
        setProject({
            id: '',
            title: '',
            description: '',
            date: Timestamp.fromDate(new Date()),
            link: '',
            tags: [],
        });
    };

    const handleEditProject = async () => {

        // optional link
        const schema = z.object({
            title: z.string().min(3).max(50),
            description: z.string().min(3).max(500),
            date: z.instanceof(Timestamp),
            link: z.string().optional(),
            tags: z.array(z.string().min(3).max(20)),
        });

        try {
            schema.parse(project);
        } catch (error) {
            toast.error(`Failed to create project`);
            return;
        }

        try {
            const promise = updateProject.mutateAsync({ data: project, id: initialProject.id });
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
        <Dialog open={projectStore.isOpen} onOpenChange={handleDropdownClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                        Edit project details
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="name"
                            value={project?.title}
                            onChange={(e) => setProject({ ...project, title: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={project?.description}
                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <DatePicker
                            date={project?.date.toDate()}
                            onSelect={(date) => {
                                if (date) {
                                    setProject({ ...project, date: Timestamp.fromDate(date) });
                                }
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link" className="text-right">
                            Link
                        </Label>
                        <Input
                            id="link"
                            value={project?.link}
                            onChange={(e) => setProject({ ...project, link: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <ProjectModalTag project={project} setProject={setProject} />
                </div>
                <Button onClick={handleEditProject}>
                    Edit
                </Button>
            </DialogContent>
        </Dialog>
    );
}


const ProjectModalTag = ({ project, setProject }: { project: Project, setProject: (project: Project) => void }) => {
    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tagValue = e.currentTarget.value.trim();
            if (tagValue) {
                setProject({ ...project, tags: [...project.tags, tagValue] });
                e.currentTarget.value = '';
            }
        }
    };

    const removeTag = (tag: string) => {
        setProject({ ...project, tags: project.tags.filter((t) => t !== tag) });
    }

    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                    Tags
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                    <Input
                        id="tags"
                        placeholder="Add tags (Press Enter to add)"
                        onKeyDown={handleTagInput}
                        className="w-full"
                    />
                    <Button
                        onClick={() => {
                            const tagInput = document.getElementById('tags') as HTMLInputElement;
                            if (tagInput) {
                                const tagValue = tagInput.value.trim();
                                if (tagValue) {
                                    setProject({ ...project, tags: [...project.tags, tagValue] });
                                    tagInput.value = '';
                                }
                            }
                        }}
                    >
                        Add Tag
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap mt-2 w-full">
                {project.tags.map((tag, index) => (
                    <Badge
                        key={index}
                        className="mr-2 mb-2 cursor-pointer transform transition hover:scale-110"
                        onClick={() => removeTag(tag)}>
                        {tag}
                    </Badge>
                ))}
            </div>
        </>
    )
}