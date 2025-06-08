'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

import { usePost, useUpdatePost } from '@/hooks/use-post';
import { PostEditor } from '@/components/editor/post-editor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { Error } from '@/components/error';
import { slugify } from '@/lib/utils';

interface PostEditorPageProps {
  params: {
    postId: string;
  };
}

const PostEditorPage = ({ params }: PostEditorPageProps) => {
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(params.postId);
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSubtitle(post.subtitle);
      setContent(post.content);
      setHtmlContent(post.htmlContent || '');
      setTags(post.tags || []);
      setPublished(post.published);
    }
  }, [post]);

  const handleSave = async () => {
    if (!post) return;

    try {
      const promise = updatePost.mutateAsync({
        id: post.id,
        data: {
          ...post,
          title,
          subtitle,
          content,
          htmlContent,
          tags,
          published,
          slug: slugify(title),
          date: Timestamp.now(),
          readingTime: Math.ceil(content.split(' ').length / 200),
        },
      });

      toast.promise(promise, {
        loading: 'Saving post...',
        success: 'Post saved successfully!',
        error: 'Failed to save post.',
      });
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/posts')}>Cancel</Button>
            <Button onClick={handleSave} variant="default">
              Save
            </Button>
            <Button
              onClick={() => setPublished(!published)}
              variant={published ? 'destructive' : 'default'}
            >
              {published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-2xl font-bold"
            />
          </div>
          <div>
            <Input
              placeholder="Post subtitle"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Tags (comma separated)"
              value={tags.join(', ')}
              onChange={e => setTags(e.target.value.split(',').map(t => t.trim()))}
            />
          </div>
          <PostEditor
            content={content}
            onChange={({ markdown, html }) => {
              setContent(markdown);
              setHtmlContent(html);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditorPage;
