import {z} from 'zod';
import {Timestamp} from 'firebase/firestore';

export const postSchema = z.object({
  title: z.string().min(3).max(100),
  subtitle: z.string().min(3).max(200),
  date: z.instanceof(Timestamp),
  content: z.string(),
  htmlContent: z.string(),
  published: z.boolean(),
  slug: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  readingTime: z.number(),
});

export type Post = z.infer<typeof postSchema> & {id: string};

export type PostWithoutId = Omit<Post, 'id'>;

export const initialPostState: PostWithoutId = {
  title: 'Untitled Post',
  subtitle: '',
  date: Timestamp.fromDate(new Date()),
  content: '',
  htmlContent: '',
  published: false,
  slug: '',
  tags: [],
  readingTime: 0,
};
