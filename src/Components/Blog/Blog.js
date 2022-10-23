import '../../App.scss';

import Navigation from '../Navigation/Navigation.js';
import BlogCard from './BlogCard';
import Footer from '../Footer.js';
import posts from './posts';

function Blog() {
    return (        
        <main className="grid grid-flow-row auto-rows-max h-full w-full">
            <section>
                <Navigation />
            </section>

            <section className="flex flex-row justify-center p-12">
                <p className="mt-1 text-base text-gray-500">
                    I write about things I find interesting.
                </p>
           </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-12">
                {posts.map((post) => (  
                    <BlogCard key={post.title} date={post.date} title={post.title} description={post.description} link={post.link} />
                ))}
            </section>

            <Footer />


        </main>
    );
}

export default Blog;
