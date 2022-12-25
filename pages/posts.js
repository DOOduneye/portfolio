import PostCard from '@/components/PostCard';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const Posts = ({ posts }) => {
    posts = posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)).filter((post) => post.frontmatter.published);
    posts = posts.reverse();

    return (
        <Layout>
            <main className="flex flex-col gap-5 p-10 h-fit">
                <section className="flex flex-row justify-center">
                    <p className="mt-1 text-base text-gray-500">
                        {`Things I\'ve written.`}
                    </p>
                </section>

                <section className="grid content-end gap-5 h-fit grid-col-1 md:grid-cols-1 lg:grid-cols-3">
                    {posts.map((post, index) => (   
                        <PostCard key={index} post={post} />
                    ))}
                </section>

                <Footer />
            </main>
        </Layout>
    );
}

const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('pages', '../content/posts'));

    const posts = files.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/posts', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return {
            frontmatter,
            slug: filename.split('.')[0],
        };
    });

    return {
        props: {
            posts,
        },
    };
};

export { getStaticProps };
export default Posts;
