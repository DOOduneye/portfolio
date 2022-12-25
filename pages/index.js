import Layout from '@/components/Layout';
import Socials from '@/components/Socials';
import ProjectCard from '@/components/ProjectCard';
import PostCard from '@/components/PostCard';
import Footer from '@/components/Footer';

import { ChevronDownIcon } from '@radix-ui/react-icons'
import { ArrowRightIcon } from '@radix-ui/react-icons'

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import headshot from '../public/assets/images/Headshot.JPG';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Markdown from '@/styles/Markdown';

const Home = ({ posts, projects, mdxSource, frontmatter: { title } }) => {

    projects = projects.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    projects = projects.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
    // limit to 3 projects
    projects = projects.slice(0, 3);

    posts = posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)).filter((post) => post.frontmatter.published);
    posts = posts.reverse();
    // limit to 6 posts
    posts = posts.slice(0, 3);

    const scroll = () => window.scrollTo(0, 750);

    return (
        <Layout>

            <main className="flex flex-col px-20 pt-20 font-sans md:pt-28 lg:px-32">

                {/* Hero */}
                <>
                    <h1 className="pb-3 font-sans font-bold text-slate-100 lg:text-9xl text-7xl">
                        <span className="drop-shadow-lg">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-500 animate-gradient-x">
                                    David Oduneye
                            </span>
                        </span>
                    </h1>
                    <span className="text-3xl font-bold text-left lg:text-7xl md:text-5xl text-slate-200/80">
                        Passionate about crafting beautiful, intuitive, and performant web applications.
                    </span>
                </>

                <Socials />
                {/* <img src="https://github-readme-stats.vercel.app/api?username=DOOduneye&show_icons=true&theme=radical" alt="Jasper's GitHub Stats" /> */}


                {/* Divider */}
                <span className="flex flex-col items-center mt-24 text-slate-100">
                    <ChevronDownIcon className='w-10 h-10 cursor-pointer animate-pulse' onClick={scroll} />
                </span> 

                {/* About Me */}
                <section className="flex flex-col gap-10 mt-8 mb-8 text-lg leading-8 text-left text-slate-200 ">     
                    <div className="flex flex-col items-center border rounded-lg shadow-md border-slate-900 lg:flex-row">
                        <Image className="object-cover w-full rounded-t-lg h-96 lg:h-120 xl:h-100 xl:w-200 md:rounded-none md:rounded-l-lg" src={headshot} alt="" />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                            <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-200">{title}</h1>
                            {/* <MDX className="text-xl font-bold text-purple-600" {...mdxSource} /> */}
                            <MDXRemote {...mdxSource} className="mb-3 font-normal text-slate-300" components={Markdown} />
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section className="flex flex-col gap-5">
                    <section className="flex flex-row justify-center p-10">
                        <p className="mt-1 text-base text-gray-500">
                            {`Things I've built* (and things I\'m working on)`}
                        </p>
                    </section>

                    <section className="grid content-end gap-5 h-fit grid-col-1 md:grid-cols-1 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))}
                    </section>

                    <section className="flex flex-row justify-center p-5">
                        <Link href="/projects">
                            <span className="flex flex-row items-center justify-center px-5 py-2 text-base font-medium text-white rounded-lg shadow-md bg-gradient-to-br from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600">
                                <span className="mr-2">View All</span>
                                <ArrowRightIcon className="w-5 h-5" />
                            </span>
                        </Link>
                    </section>
                </section>

                {/* Blog Posts */}
                <section className="grid w-full h-full grid-flow-row mb-5 auto-row-max">
                    <section className="flex flex-row justify-center p-10">
                        <p className="mt-1 text-base text-gray-500">
                            {`Things I\'ve written.`}
                        </p>
                    </section>

                    <section className="grid gap-5 px-5 grid-col-1 md:grid-cols-1 lg:grid-cols-3">
                        {posts.map((post, index) => (   
                            <PostCard key={index} post={post} />
                        ))}
                    </section>

                    <section className="flex flex-row justify-center p-5">
                        <Link href="/blog">
                            <span className="flex flex-row items-center justify-center px-5 py-2 text-base font-medium text-white rounded-lg shadow-md bg-gradient-to-br from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600">
                                <span className="mr-2">View All</span>
                                <ArrowRightIcon className="w-5 h-5" />
                            </span>
                        </Link>
                    </section>
                </section>

                {/* Footer */}
                <Footer />
                
                
            </main>
        </Layout>
    );
}

const getStaticProps = async () => {
    const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/', 'about.mdx'), 'utf-8');
    const projectFiles = fs.readdirSync(path.join('pages', '../content/projects'));
    const postFiles = fs.readdirSync(path.join('pages', '../content/posts'));

    const projects = projectFiles.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/projects', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return { 
            frontmatter, 
            slug: filename.split('.')[0] 
        };
    });

    const posts = postFiles.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/posts', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

    
        return {
            frontmatter,
            slug: filename.split('.')[0],
        };
    });
    
    const { data: frontmatter, content } = matter(markdownWithMeta);
    const mdxSource = await serialize(content);

    return {
        props: {
            frontmatter: frontmatter,
            mdxSource: mdxSource,
            projects: projects,
            posts: posts,
        },
    };
};

export default Home;
export { getStaticProps };