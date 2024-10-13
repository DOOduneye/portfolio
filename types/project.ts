import {z} from 'zod';
import {Timestamp} from 'firebase/firestore';

export const projectSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(3).max(500),
  date: z.instanceof(Timestamp),
  link: z.string().optional(),
  tags: z.array(z.string().min(1).max(20)),
  published: z.boolean(),
});

export type Project = z.infer<typeof projectSchema> & {id: string};

export type ProjectWithoutId = Omit<Project, 'id'>;

export const initialProjectState: ProjectWithoutId = {
  title: '',
  description: '',
  date: Timestamp.fromDate(new Date()),
  link: '',
  tags: [],
  published: false,
};
