'use client';

import {Plus} from 'lucide-react';

import {useProjectStore} from '@/hooks/use-modal';

import {AllProjects} from './_components/all-projects';
import {Button} from '@/components/ui/button';

const Projects = () => {
  const store = useProjectStore();

  return (
    <div className="flex flex-col w-full max-w-5xl space-y-4 mt-10 ">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-3xl font-bold">Projects</h1>
          <span className="text-sm text-muted-foreground sm:text-md">
            Manage your projects.
          </span>
        </div>
        <Button onClick={store.onOpen}>
          <Plus className="w-4 h-4" />
          <span className="ml-2">New Project</span>
        </Button>
      </div>
      <div>
        <AllProjects />
      </div>
    </div>
  );
};

export default Projects;
