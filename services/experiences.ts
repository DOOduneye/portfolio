import { Timestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Experience = {
    id: string;
    from: Timestamp;
    to?: Timestamp;
    company: string;
    role: string;
    description: string;
};

export async function getAllExperiences(): Promise<Experience[]> {
    const experiencesSnapshot = await getDocs(collection(db, 'experiences'));

    const experiences: Experience[] = experiencesSnapshot.docs.map((experiences) => ({
        id: experiences.id,
        ...experiences.data() as { from: Timestamp; to?: Timestamp; company: string; role: string; description: string; }
    }));

    return experiences;
}
