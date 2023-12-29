"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface PostProps {
    params: {
        postId: string;
    };
}

const Post = ({ params }: PostProps) => {
    // const { data: post, isLoading, error } = usePost(params.postId);

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>{error.message}</p>;

    const post = {
        id: "1",
        title: "Hello, world!",
        subtitle: "This is a subtitle",
        date: new Date(),
        content: "This is the content",
    };

    const markdown = `
# A demo of \`react-markdown\`

\`react - markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
* Has a lot of plugins

## Contents

Here is an example of a plugin in action
([\`remark - toc\`](https://github.com/remarkjs/remark-toc)).
**This section is replaced by an actual table of contents**.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[\`rehype - highlight\`](https://github.com/rehypejs/rehype-highlight).

~~~js
    import React from 'react'
    import ReactDOM from 'react-dom'
    import Markdown from 'react-markdown'
    import rehypeHighlight from 'rehype-highlight'

    const markdown = \`# Your markdown here\`

    ReactDOM.render(
        <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>,
        document.querySelector('#content')
    )
~~~

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can *also* use a plugin:
[\`remark - gfm\`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark - gfm\` |

~~strikethrough~~

* [ ] task list
* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
use [\`rehype - raw\`](https://github.com/rehypejs/rehype-raw).
You should probably combine it with
[\`rehype - sanitize\`](https://github.com/rehypejs/rehype-sanitize).

<blockquote>
  👆 Use the toggle above to add the plugin.
</blockquote>

## Components

You can pass components to change things:

~~~js
    import React from 'react'
    import ReactDOM from 'react-dom'
    import Markdown from 'react-markdown'
    import MyFancyRule from './components/my-fancy-rule.js'

    const markdown = \`
        # Your markdown here
\`

    ReactDOM.render(
        <Markdown
            components={{
                // Use h2s instead of h1s
                h1: 'h2',
                // Use a component instead of hrs
                hr(props) {
                    const { node, ...rest } = props
                    return <MyFancyRule {...rest} />
      }
        }}
    >
        {markdown}
    </Markdown>,
    document.querySelector('#content')
)
~~~

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)
`
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
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                className="prose"
            >
                {markdown}
            </Markdown>
        </div>
    );
};

export default Post;
