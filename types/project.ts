import { Timestamp } from "firebase/firestore";

export type Project = {
    id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
    date: Timestamp;
};

export type ProjectWithoutId = Omit<Project, 'id'>;