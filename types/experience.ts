import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export const experienceSchema = z.object({
    from: z.instanceof(Timestamp),
    to: z.instanceof(Timestamp).optional(),
    company: z.string().min(3).max(50),
    role: z.string().min(3).max(50),
    description: z.string().min(3).max(500),
});

export type Experience = z.infer<typeof experienceSchema> & { id: string };

export type ExperienceWithoutId = Omit<Experience, 'id'>;

export const initialExperienceState: ExperienceWithoutId = {
    from: Timestamp.now(),
    to: Timestamp.now(),
    company: '',
    role: '',
    description: '',
};