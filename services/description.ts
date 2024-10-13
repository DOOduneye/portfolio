import {getDoc, doc, setDoc} from 'firebase/firestore';

import {db} from '@/lib/firebase';
import {DESCRIPTION_ID, type Description} from '@/types/description';

/**
 * Fetches the description from the Firestore 'description' collection.
 * @returns A Promise that resolves to
 */
export const getDescription = async (): Promise<Description> => {
  const descriptionSnapshot = await getDoc(
    doc(db, 'description', DESCRIPTION_ID)
  );
  if (!descriptionSnapshot.exists()) {
    throw new Error(`Description with ID ${DESCRIPTION_ID} does not exist.`);
  }

  const descriptionData = descriptionSnapshot.data() as Description;
  const description: Description = {
    ...descriptionData,
    id: descriptionSnapshot.id,
  };

  return description;
};

/**
 * Updates the description in the Firestore 'description' collection.
 * @param description - The new description to update.
 * @returns A Promise that resolves when the description has been updated.
 */
export const updateDescription = async (
  description: Description
): Promise<void> => {
  await setDoc(doc(db, 'description', DESCRIPTION_ID), description);
};
