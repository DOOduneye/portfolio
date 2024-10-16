'use client';

import {groupBy} from '@/lib/utils';
import {useProjects} from '@/hooks/use-project';

import {ProjectCard} from '@/app/(home)/_components/project-card';
import {Error} from '@/components/error';
import {Skeletons} from '@/components/ui/skeleton';

const Projects = () => {
  const {data: projects, isLoading, error} = useProjects();

  if (error) return <Error message={error.message} />;

  const publishedProjects = (projects || []).filter(
    project => project.published
  );

  const groupedProjects = groupBy(publishedProjects || [], project =>
    project.date.toDate().getFullYear().toString()
  );

  const sortedYears = Object.keys(groupedProjects).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Projects</h2>
      {isLoading && <Skeletons skeleton={ProjectCard.Skeleton} />}
      {sortedYears.map(year => (
        <div key={year} className="flex flex-col gap-4">
          <h3 className="mt-4 text-lg font-semibold">{year}</h3>
          {groupedProjects[year]
            .sort(
              (a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()
            )
            .map(project => (
              <ProjectCard project={project} key={project.id} />
            ))}
        </div>
      ))}
    </main>
  );
};

export default Projects;
