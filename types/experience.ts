import { Timestamp } from "firebase/firestore";
import { Project } from "./project";

export type Experience = {
    id: string;
    from: Timestamp;
    to?: Timestamp;
    company: string;
    role: string;
    description: string;
};

export type ExperienceWithoutId = Omit<Experience, 'id'>;