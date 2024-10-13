'use client';

import {Plus} from 'lucide-react';

import {useExperienceStore} from '@/hooks/use-modal';

import {AllExperiences} from './_components/all-experiences';
import {Button} from '@/components/ui/button';

const Experiences = () => {
  const store = useExperienceStore();

  return (
    <div className="flex flex-col w-full max-w-5xl space-y-4 mt-10 ">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-3xl font-bold">Experience</h1>
          <span className="text-sm text-muted-foreground sm:text-md">
            Manage your experience.
          </span>
        </div>
        <Button onClick={store.onOpen}>
          <Plus className="w-4 h-4" />
          <span className="ml-2">New Experience</span>
        </Button>
      </div>
      <div>
        <AllExperiences />
      </div>
    </div>
  );
};

export default Experiences;
