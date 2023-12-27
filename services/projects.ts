import { Timestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Project = {
    id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
    date: Timestamp;
};

export async function getAllProjects(): Promise<Project[]> {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));

    const projects: Project[] = projectsSnapshot.docs.map((project) => ({
        ...project.data() as Project
    }));

    return projects;
}
