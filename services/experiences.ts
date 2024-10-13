import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

import {db} from '@/lib/firebase';
import {ExperienceWithoutId, type Experience} from '@/types/experience';

/**
 * Fetches all experiences from the Firestore 'experiences' collection.
 * @returns A Promise that resolves to an array of Experience objects.
 */
export const getAllExperiences = async (): Promise<Experience[]> => {
  const experiencesSnapshot = await getDocs(collection(db, 'experiences'));

  if (experiencesSnapshot.empty) {
    return [];
  }

  const experiences: Experience[] = [];
  experiencesSnapshot.forEach(experiencesSnapshot => {
    const experienceData = experiencesSnapshot.data() as Experience;
    const experience: Experience = {
      ...experienceData,
      id: experiencesSnapshot.id,
    };

    experiences.push(experience);
  });

  return experiences;
};

/**
 * Fetches a specific experience by its ID from the Firestore 'experiences' collection.
 * @param id - The ID of the experience to retrieve.
 * @returns A Promise that resolves to the specified Experience object or throws an error if the experience does not exist.
 */
export const getExperienceById = async (id: string): Promise<Experience> => {
  const experienceSnapshot = await getDoc(doc(db, 'experiences', id));

  if (!experienceSnapshot.exists()) {
    throw new Error(`Experience with ID ${id} does not exist.`);
  }

  const experienceData = experienceSnapshot.data() as Experience;
  const experience: Experience = {
    ...experienceData,
    id: experienceSnapshot.id,
  };

  return experience;
};

/**
 * Adds a new experience to the Firestore 'experiences' collection.
 * @param experience - The Experience object to be added without the ID property.
 * @returns A Promise that resolves when the experience has been added.
 */
export const createExperience = async (
  experience: ExperienceWithoutId
): Promise<void> => {
  await addDoc(collection(db, 'experiences'), experience);
};

/**
 * Updates an existing experience in the Firestore 'experiences' collection.
 * @param id - The ID of the experience to update.
 * @param experience - The updated Experience object.
 * @returns A Promise that resolves when the experience has been updated.
 */
export const updateExperience = async (
  id: string,
  experience: Experience
): Promise<void> => {
  await setDoc(doc(db, 'experiences', id), experience);
};
/**
 * Deletes an experience from the Firestore 'experiences' collection by its ID.
 * @param id - The ID of the experience to delete.
 * @returns A Promise that resolves when the experience has been deleted.
 */
export const deleteExperience = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'experiences', id));
};
