'use client';

import {Error} from '@/components/error';
import {Skeleton, Skeletons} from '@/components/ui/skeleton';
import {useDescription} from '@/hooks/use-description';

export const HomeScreenDescription = () => {
  const {data: description, isLoading, error} = useDescription();

  if (error) return <Error message={error.message} />;

  if (isLoading) return <Skeletons skeleton={HomeScreenDescription.Skeleton} />;

  return (
    <div>
      <h1 className="text-2xl font-bold">{description?.title}</h1>
      <p className="mt-4 text-sm font-normal dark:text-muted-foreground text-gray-500">
        {description?.description}
      </p>
    </div>
  );
};

HomeScreenDescription.Skeleton = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  return (
    <div className="space-y-2" {...props}>
      <h1 className="text-2xl font-bold">
        <Skeleton className="w-1/2" />
      </h1>
      <div className="mt-4 text-sm font-normal dark:text-muted-foreground text-gray-500">
        <Skeleton className="w-3/4" />
      </div>
    </div>
  );
};
