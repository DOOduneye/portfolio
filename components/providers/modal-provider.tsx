"use client"

import { useEffect, useState } from "react";
import { SettingsModal } from "@/components/modals/settings-modal";
import { CreateProjectModal } from "../modals/create-project-modal";


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreateProjectModal />
            <SettingsModal />
        </>

    )
}