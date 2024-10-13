'use client';

import {useEffect, useState} from 'react';

import {SettingsModal} from '@/components/modals/settings-modal';
import {CreateProjectModal} from '@/components/modals/create-project-modal';
import {EditProjectModal} from '@/components/modals/edit-project-modal';
import {CreateExperienceModal} from '@/components/modals/create-experience-modal';
import {EditExperienceModal} from '@/components/modals/edit-experience-modal';
import {EditDescriptionModal} from '@/components/modals/edit-description-modal';

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
      <EditDescriptionModal />
      <SettingsModal />
    </>
  );
};
