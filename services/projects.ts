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
        id: project.id,
        ...project.data() as { title: string; description: string; link: string; tags: string[]; date: Timestamp; }
    }));

    return projects;
}

// export async function getProjectById(id: string): Promise<Project> {
//     const projectSnapshot = await getDoc(collection(db, 'projects'), id);

//     const project = projectSnapshot.docs.map((project) => ({
//         ...project.data() as Project
//     })).find((project) => project.id === id);

//     return project;
// }