"use client"

import { useEffect, useState } from "react";
import { SettingsModal } from "@/components/modals/settings-modal";
import { CreateProjectModal } from "../modals/create-project-modal";
import { EditProjectModal } from "../modals/edit-project-modal";
import { Timestamp } from 'firebase/firestore';
import { CreateExperienceModal } from "../modals/create-experience-modal";
import { EditExperienceModal } from "../modals/edit-experience-modal";


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <EditExperienceModal />
            <CreateExperienceModal />
            <CreateProjectModal />
            <EditProjectModal />
            <SettingsModal />
        </>

    )
}