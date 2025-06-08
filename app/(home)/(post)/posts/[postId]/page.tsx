'use client';

import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';

import {usePost} from '@/hooks/use-post';
import { Spinner } from '@/components/spinner';
import { Error } from '@/components/error';

interface PostProps {
  params: {
    postId: string;
  };
}

const Post = ({params}: PostProps) => {
  const { data: post, isLoading, error } = usePost(params.postId);

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!post) return <Error message="Post not found" />;

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <Link
        href="/posts"
        className="group flex flex-row gap-2 items-center cursor-pointer duration-300 ease-in-out lg:absolute sm:left-20 md:left-10 font-semibold md:transform md:hover:-translate-x-1 md:transition-transform"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to posts</span>
      </Link>
      <p className="text-sm text-gray-500">
        Published on{' '}
        {post.date.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        {post.readingTime && ` · ${post.readingTime} min read`}
      </p>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <h2 className="text-xl text-muted-foreground">{post.subtitle}</h2>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.htmlContent || post.content }}
      />
    </div>
  );
};

export default Post;
