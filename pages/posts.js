import PostCard from '@/components/PostCard';
import Post from '@/components/Post';
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
            <main className="grid w-full h-full grid-flow-row px-6 mb-5 auto-row-max">
                <Post posts={posts} />
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
