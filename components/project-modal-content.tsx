import { Dispatch, SetStateAction } from "react";

import { Timestamp } from "firebase/firestore";

import { Project, ProjectWithoutId } from "@/types/project";

import {
    DialogDate,
    DialogInput,
    DialogSelector,
    DialogTextArea
} from "@/components/dialog";

interface ProjectModalContentProps<T extends Project | ProjectWithoutId> {
    project: T;
    setProject: Dispatch<SetStateAction<T>>;
}

export function ProjectModalContent<T extends Project | ProjectWithoutId>({ project, setProject }: ProjectModalContentProps<T>) {
    return (
        <div className="grid gap-4 py-4">
            <DialogInput
                title="Title"
                label="title"
                value={project?.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
            />
            <DialogTextArea
                title="Description"
                label="description"
                value={project?.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
            <DialogDate
                title="Date"
                label="date"
                date={project?.date?.toDate()}
                onSelect={(date) => {
                    if (date) {
                        setProject({ ...project, date: Timestamp.fromDate(date) });
                    }
                }}
            />
            <DialogInput
                title="Link"
                label="link"
                value={project?.link || ''}
                onChange={(e) => setProject({ ...project, link: e.target.value })}
            />
            <DialogSelector
                title="Tags"
                label="tags"
                selected={project?.tags || []}
                setSelected={(tags) => setProject({ ...project, tags })}
            />
        </div>
    )
}