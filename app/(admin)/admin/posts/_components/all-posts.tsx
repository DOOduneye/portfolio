'use client';

import {usePosts} from '@/hooks/use-post';

import {PostCard} from './post-card';
import {Spinner} from '@/components/spinner';
import {Error} from '@/components/error';
import {Skeletons} from '@/components/ui/skeleton';
import {CardSkeleton} from '../../_components/card-skeleton';

export const AllPosts = () => {
  const {data: posts, error, isLoading} = usePosts();

  if (error) return <Error message={error.message} />;

  return (
    <>
      {isLoading && <Skeletons skeleton={CardSkeleton} />}
      {posts &&
        posts
          .sort((a, b) => b.date.toMillis() - a.date.toMillis())
          .map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              length={posts.length}
            />
          ))}
    </>
  );
};
