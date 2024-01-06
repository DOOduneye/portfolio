import { Timestamp } from "firebase/firestore";

export type Post = {
    id: string;
    title: string;
    subtitle: string;
    date: Timestamp;
    content: string;
    published: boolean;
};

export type PostWithoutId = Omit<Post, 'id'>;
