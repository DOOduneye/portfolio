import PostCard from '@/components/PostCard'
import CardHeader from '@/components/Card/CardHeader'
import { ContentContainer } from '@/styles/styles';
import { MapPosts } from '@/styles/styles';

import tw from 'tailwind-styled-components';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

// const ContentContainer = tw.main`  
//     grid
//     grid-flow-row
//     auto-rows-max
//     h-full
//     w-full
//     mb-10
// `;

// const MapPosts = tw.section`
//     grid 
//     grid-col-1 
//     md:grid-cols-1 
//     lg:grid-cols-3 
//     gap-5 
//     px-5
    
// `;

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
