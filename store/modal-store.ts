"use client";

import { Experience } from "@/types/experience";
import { Post } from "@/types/post";
import { Project } from "@/types/project";
import { create } from "zustand";

export type ModalStore<T> = {
    isOpen: boolean;
    data: T;
    setData: (data: T) => void;
    onOpen: () => void;
    onClose: () => void;
};

export const createModalStore = <T>() => {
    return create<ModalStore<T>>((set) => ({
        isOpen: false,
        data: {} as T,
        setData: (data: T) => set((state) => ({ data: { ...state.data, ...data } })),
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false }),
    }));
};


export const useExperienceStore = createModalStore<Experience>();
export const useEditExperienceStore = createModalStore<Experience>();

export const useProjectStore = createModalStore<Project>();
export const useEditProjectStore = createModalStore<Project>();

export const usePostStore = createModalStore<Post>();
export const useEditPostStore = createModalStore<Post>();
