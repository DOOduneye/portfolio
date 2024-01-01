"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { usePost } from "@/hooks/use-post";
import React from "react";

interface PostProps {
    params: {
        postId: string;
    };
}

const Post = ({ params }: PostProps) => {
    // const { data: post, isLoading, error } = usePost(params.postId);

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>{error.message}</p>;

    const content = `
The text below is from the [Tailwind
CSS](https://play.tailwindcss.com/uj1vGACRJA?layout=preview) docs. I copied it
here to test the markdown styles. **Tailwind is awesome. You should use it.**

Until now, trying to style an article, document, or blog post with Tailwind has been a tedious task that required a keen eye for typography and a lot of complex custom CSS.

By default, Tailwind removes all of the default browser styling from paragraphs, headings, lists and more.This ends up being really useful for building application UIs because you spend less time undoing user - agent styles, but when you _really are_ just trying to style some content that came from a rich - text editor in a CMS or a markdown file, it can be surprising and unintuitive.

We get lots of complaints about it actually, with people regularly asking us things like:

> Why is Tailwind removing the default styles on my \`h1\` elements ? How do I disable this ? What do you mean I lose all the other base styles too ?
> We hear you, but we're not convinced that simply disabling our base styles is what you really want. You don't want to have to remove annoying margins every time you use a \`p\` element in a piece of your dashboard UI.And I doubt you really want your blog posts to use the user - agent styles either — you want them to look _awesome_, not awful.

The \`@tailwindcss/typography\` plugin is our attempt to give you what you _actually_ want, without any of the downsides of doing something stupid like disabling our base styles.

It adds a new \`prose\` class that you can slap on any block of vanilla HTML content and turn it into a beautiful, well - formatted document:

~~~js
<article class="prose">
  <h1>Garlic bread with cheese: What the science tells us</h1>
  <p>
    For years parents have espoused the health benefits of eating garlic bread
    with cheese to their children, with the food earning such an iconic status
    in our culture that kids will often dress up as warm, cheesy loaf for
    Halloween.
  </p>
  <p>
    But a recent study shows that the celebrated appetizer may be linked to a
    series of rabies cases springing up around the country.
  </p>
</article>
~~~

For more information about how to use the plugin and the features it includes, [read the documentation](https://github.com/tailwindcss/typography/blob/master/README.md).

---
`
    const post = {
        title: "Test",
        subtitle: "Test",
        content: content,
        date: new Date()
    }

    return (
        <div className="flex flex-col gap-4">
            <Link
                href="/posts"
                className="group flex flex-row gap-2 items-center cursor-pointer duration-300 ease-in-out lg:absolute sm:left-20 md:left-10 font-semibold md:transform md:hover:-translate-x-1 md:transition-transform"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to posts</span>
            </Link>
            <p className="text-sm text-gray-500">
                Published on{" "}
                {post?.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
            <div className="flex flex-col gap-3">
                <h2 className="text-5xl font-bold">{post?.title}</h2>
                <h3 className="text-lg text-muted-foreground">{post?.subtitle}</h3>
            </div>
            <Markdown
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
                className="prose prose-slate dark:prose-invert prose-sm md:prose-md lg:prose-lg"
            >
                {post?.content}
            </Markdown>
        </div>
    );
};

export default Post;
