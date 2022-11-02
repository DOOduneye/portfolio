import PostCard from '@/components/PostCard'
import CardHeader from '@/components/Card/CardHeader'
import { ContentContainer, MapPosts } from '@/styles/styles';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';


const Posts = ({ posts }) => {
    return (
        <ContentContainer>
            <CardHeader title={'Things I\'ve written.'} />

            <MapPosts>
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </MapPosts>
        </ContentContainer>
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
