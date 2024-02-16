import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { PostWithoutId, type Post } from "@/types/post";

/**
 * Fetches all posts from the Firestore 'posts' collection.
 * @returns A Promise that resolves to an array of Post objects.
 */
export const getAllPosts = async (): Promise<Post[]> => {
    const postsSnapshot = await getDocs(collection(db, "posts"));

    if (postsSnapshot.empty) {
        return [];
    }

    const posts: Post[] = [];
    postsSnapshot.forEach((postSnapshot) => {
        const postData = postSnapshot.data() as Post;
        const post: Post = {
            ...postData,
            id: postSnapshot.id,
        };

        posts.push(post);
    });

    return posts;
}

// TODO: testing
export const getPostMetadata = async (): Promise<Post[]> => {
    const posts: Post[] = [];

    const postRef = ref(storage, 'posts/');

    listAll(postRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                console.log(itemRef);
            })
        });

    return posts;
}

// TODO: add extension to file name
export const getPost = async (name: string): Promise<string> => {
    const pathReference = ref(storage, `posts/${name}`);
    const url = await getDownloadURL(pathReference);

    // Fetch the markdown file using its URL
    const response = await fetch(url);

    if (response.ok) {
        // If the response is successful, extract the text content
        const text = await response.text();
        return text; // Return the markdown text
    } else {
        throw new Error("Failed to fetch the markdown file");
    }
};


/**
 * Fetches a specific post by its ID from the Firestore 'posts' collection.
 * @param id - The ID of the post to retrieve.
 * @returns A Promise that resolves to the specified Post object.
 */
export const getPostById = async (id: string): Promise<Post> => {
    const postSnapshot = await getDoc(doc(db, "posts", id));

    if (!postSnapshot.exists()) {
        throw new Error(`Post with ID ${id} does not exist.`);
    }

    const postData = postSnapshot.data() as Post;
    const post: Post = {
        ...postData,
        id: postSnapshot.id,
    };

    return post;
}

/**
 * Adds a new post to the Firestore 'posts' collection.
 * @param post - The Post object to be added without the ID property.
 * @returns A Promise that resolves when the post has been added.
 */
export const createPost = async (post: PostWithoutId): Promise<void> => {
    await addDoc(collection(db, "posts"), post);
}

/**
 * Updates an existing post in the Firestore 'posts' collection.
 * @param id - The ID of the post to update.
 * @param post - The updated Post object.
 * @returns A Promise that resolves when the post has been updated.
 */
export const updatePost = async (id: string, post: Post): Promise<void> => {
    await setDoc(doc(db, "posts", id), post);
}

/**
 * Deletes an post from the Firestore 'posts' collection by its ID.
 * @param id - The ID of the post to delete.
 * @returns A Promise that resolves when the post has been deleted.
 */
export const deletePost = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "posts", id));
}