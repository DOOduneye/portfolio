import {z} from 'zod';

export const DESCRIPTION_ID = process.env.NEXT_PUBLIC_DESCRIPTION_ID;

export const descriptionSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(1).max(3000),
});

export type Description = z.infer<typeof descriptionSchema> & {id: string};

export type DescriptionWithoutId = Omit<Description, 'id'>;

export const initialDescriptionState: DescriptionWithoutId = {
  title: '',
  description: '',
};
