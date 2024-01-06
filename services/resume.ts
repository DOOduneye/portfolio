import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Gets the url of the resume
 * @returns the url of the resume
 */
export const getResume = async () => {
    const pathReference = ref(storage, 'resume/Resume.pdf');
    return await getDownloadURL(pathReference);
}

/**
 * Updates the resume
 * @param file the file to update the resume with
 * @returns the url of the resume
 */
export const updateResume = async (file: File) => {
    const storageRef = ref(storage, 'resume/Resume.pdf');
    await uploadBytes(storageRef, file);
}