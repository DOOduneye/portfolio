import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export const experienceSchema = z.object({
    from: z.instanceof(Timestamp),
    to: z.instanceof(Timestamp),
    company: z.string().min(3).max(50),
    role: z.string().min(3).max(50),
    description: z.string().min(1).max(500),
    published: z.boolean(),
    location: z.string().min(3).max(50),
}).refine(data => data.from.toDate().getTime() <= data.to.toDate().getTime(), {
    message: 'Start date must be before end date',
});

export type Experience = z.infer<typeof experienceSchema> & { id: string };

export type ExperienceWithoutId = Omit<Experience, 'id'>;

export const initialExperienceState: ExperienceWithoutId = {
    from: Timestamp.now(),
    to: Timestamp.now(),
    company: '',
    role: '',
    description: '',
    published: false,
    location: '',
};