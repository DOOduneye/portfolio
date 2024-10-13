'use client';

import {useDescription} from '@/hooks/use-description';
import {DescriptionCard} from './_components/description-card';
import {Error} from '@/components/error';
import {Skeletons} from '@/components/ui/skeleton';
import {CardSkeleton} from '../_components/card-skeleton';

const Description = () => {
  const {data: description, isLoading, error} = useDescription();

  return (
    <div className="flex flex-col w-full max-w-5xl space-y-4 mt-10 ">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-3xl font-bold">Description</h1>
          <span className="text-sm text-muted-foreground sm:text-md">
            Manage your description.
          </span>
        </div>
      </div>
      {error && <Error message={error.message} />}
      {isLoading && <Skeletons skeleton={CardSkeleton} />}
      {description && <DescriptionCard {...description} />}
    </div>
  );
};

export default Description;
