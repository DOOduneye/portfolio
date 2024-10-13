'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

import {cn} from '@/lib/utils';
import {Post} from '@/types/post';
import {Skeleton} from '@/components/ui/skeleton';

interface PostCardProps {
  post: Post;
  index: number;
  length: number;
}

export const PostCard = ({
  post: {id, title, subtitle, date, content},
  index,
  length,
}: PostCardProps) => {
  const timeToRead = Math.ceil(content.split(' ').length / 200);

  const [isFirst, setIsFirst] = useState(index === 0);
  const [isLast, setIsLast] = useState(index === length - 1);

  useEffect(() => {
    setIsFirst(index === 0);
    setIsLast(index === length - 1);
  }, [index, length]);

  return (
    <Link
      href={`/posts/${id}`}
      className={cn(
        'p-5 border border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 hover:border-gray-500',
        {
          'rounded-t-xl': isFirst,
          'rounded-b-xl': isLast,
        }
      )}
    >
      <div className="flex flex-row justify-between gap-x-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500">
          {date.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex flex-row justify-between gap-x-4">
        <p className="text-sm text-gray-500">{subtitle}</p>
        <p className="text-sm text-gray-500">{timeToRead} min read</p>
      </div>
    </Link>
  );
};

PostCard.Skeleton = () => {
  return (
    <div className="p-5 border border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 hover:border-gray-500">
      <div className="flex flex-row justify-between gap-x-4">
        <Skeleton className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-1/4 h-4" />
      </div>
      <div className="flex flex-row justify-between gap-x-4">
        <Skeleton className="w-1/2 h-4 mb-2" />
        <Skeleton className="w-1/6 h-4" />
      </div>
    </div>
  );
};
