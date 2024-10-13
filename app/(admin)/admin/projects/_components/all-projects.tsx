'use client';

import {useProjects} from '@/hooks/use-project';

import {ProjectCard} from './project-card';
import {CardSkeleton} from '../../_components/card-skeleton';
import {Error} from '@/components/error';
import {Skeletons} from '@/components/ui/skeleton';

export const AllProjects = () => {
  const {data: projects, error, isLoading} = useProjects();

  if (error) return <Error message={error.message} />;

  return (
    <>
      {isLoading && <Skeletons skeleton={CardSkeleton} />}
      {projects &&
        projects
          .sort((a, b) => b.date.toMillis() - a.date.toMillis())
          .map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              length={projects.length}
            />
          ))}
    </>
  );
};
