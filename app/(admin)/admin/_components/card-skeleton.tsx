import {Skeleton} from '@/components/ui/skeleton';

export const CardSkeleton = () => {
  return (
    <div className="flex flex-row p-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900">
      <div className="flex flex-col justify-between gap-x-4 w-full">
        <Skeleton className="w-1/2 h-4 mb-2" />
        <Skeleton className="w-1/4 h-4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
  );
};
