import {
    Timestamp,
    collection,
    getDocs,
    getDoc,
    doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Post = {
    id: string;
    title: string;
    subtitle: string;
    date: Timestamp;
    content: string;
};

export async function getAllPosts(): Promise<Post[]> {
    const postsSnapshot = await getDocs(collection(db, "posts"));

    const posts: Post[] = postsSnapshot.docs.map((posts) => ({
        id: posts.id,
        ...(posts.data() as {
            title: string;
            subtitle: string;
            date: Timestamp;
            content: string;
        }),
    }));

    return posts;
}

export async function getPostById(id: string): Promise<Post> {
    const postSnapshot = await getDoc(doc(db, "posts", id));

    console.log("postSnapshot", postSnapshot);

    const post: Post = {
        id: postSnapshot.id,
        ...(postSnapshot.data() as {
            title: string;
            subtitle: string;
            date: Timestamp;
            content: string;
        }),
    };

    return post;
}