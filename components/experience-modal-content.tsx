import { Dispatch, SetStateAction } from "react";
import { Timestamp } from "firebase/firestore";

import { Experience, ExperienceWithoutId } from "@/types/experience";

import {
    DialogDate,
    DialogInput,
    DialogTextArea,
} from "@/components/dialog";

interface ExperienceModalContentProps<T extends Experience | ExperienceWithoutId> {
    experience: T;
    setExperience: Dispatch<SetStateAction<T>>;
}

export function ExperienceModalContent<T extends Experience | ExperienceWithoutId>({ experience, setExperience }: ExperienceModalContentProps<T>) {
    return (
        <div className="grid gap-4 py-4">
            <DialogInput
                title="Role"
                label="role"
                value={experience?.role}
                onChange={(e) => setExperience({ ...experience, role: e.target.value })}
            />
            <DialogInput
                title="Company"
                label="company"
                value={experience?.company}
                onChange={(e) => setExperience({ ...experience, company: e.target.value })}
            />
            <DialogDate
                title="Start Date"
                label="startDate"
                date={experience?.from?.toDate()}
                onSelect={(date) => {
                    if (date) {
                        setExperience({ ...experience, from: Timestamp.fromDate(date) });
                    }
                }}
            />
            <DialogDate
                title="End Date"
                label="endDate"
                date={experience?.to?.toDate() || new Date()}
                onSelect={(date) => {
                    if (date) {
                        setExperience({ ...experience, to: Timestamp.fromDate(date) });
                    }
                }}
            />
            <DialogTextArea
                title="Description"
                label="description"
                value={experience?.description}
                onChange={(e) => setExperience({ ...experience, description: e.target.value })}
            />
        </div>
    )
}