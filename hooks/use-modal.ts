import {create} from 'zustand';

import type {Experience} from '@/types/experience';
import type {Post} from '@/types/post';
import type {Project} from '@/types/project';
import {Description} from '@/types/description';

export type ModalStore<T> = {
  isOpen: boolean;
  data: T;
  setData: (data: T) => void;
  onOpen: () => void;
  onClose: () => void;
};

export const createModalStore = <T>() => {
  return create<ModalStore<T>>(set => ({
    isOpen: false,
    data: {} as T,
    setData: (data: T) => set(state => ({data: {...state.data, ...data}})),
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
  }));
};

export const useDescriptionStore = createModalStore<Description>();
export const useEditDescriptionStore = createModalStore<Description>();

export const useExperienceStore = createModalStore<Experience>();
export const useEditExperienceStore = createModalStore<Experience>();

export const useProjectStore = createModalStore<Project>();
export const useEditProjectStore = createModalStore<Project>();

export const usePostStore = createModalStore<Post>();
export const useEditPostStore = createModalStore<Post>();
