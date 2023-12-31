import { Timestamp } from "firebase/firestore";

// Type definition for a Post object
export type Post = {
    id: string;
    title: string;
    subtitle: string;
    date: Timestamp;
    content: string;
};

export type PostWithoutId = Omit<Post, 'id'>;
