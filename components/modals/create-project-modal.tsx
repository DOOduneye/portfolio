
import { useState } from 'react';
import { useCreateProject, useProjectStore } from '@/hooks/use-project';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Project, ProjectWithoutId } from '@/types/project';
import { Input } from '../ui/input';
import { Timestamp } from 'firebase/firestore';
import { Textarea } from '../ui/textarea';
import { DatePicker } from '@/app/(admin)/admin/_components/date-picker';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { z } from 'zod';

export const CreateProjectModal = () => {
    const projectStore = useProjectStore();
    const createProject = useCreateProject();

    const [project, setProject] = useState<ProjectWithoutId>({
        title: '',
        description: '',
        date: Timestamp.fromDate(new Date()),
        link: '',
        tags: [],
    });

    const handleDropdownClose = () => {
        projectStore.onClose();
        // Clear all data when the dropdown closes
        setProject({
            title: '',
            description: '',
            date: Timestamp.fromDate(new Date()),
            link: '',
            tags: [],
        });
    };

    const handleCreateProject = async () => {

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
        <Dialog open={projectStore.isOpen} onOpenChange={handleDropdownClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle>New Project</DialogTitle>
                    <DialogDescription>
                        Create a new project.
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
                <Button onClick={handleCreateProject}>
                    Create
                </Button>
            </DialogContent>
        </Dialog>
    );
}


const ProjectModalTag = ({ project, setProject }: { project: ProjectWithoutId, setProject: (project: ProjectWithoutId) => void }) => {
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