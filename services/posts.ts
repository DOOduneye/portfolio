import { Timestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Post = {
    id: string;
    title: string;
    subtitle: string;
    date: Timestamp;
    content: string;
};

export async function getAllPosts(): Promise<Post[]> {
    const postsSnapshot = await getDocs(collection(db, 'posts'));

    const posts: Post[] = postsSnapshot.docs.map((posts) => ({
        ...posts.data() as Post
    }));

    return posts;
}
