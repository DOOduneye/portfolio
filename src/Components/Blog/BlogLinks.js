import posts from './posts';
import Post from '../Post';

import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';



function BlogLinks() {
    return (
        <BrowserRouter>
            <Routes>
                {posts.map((post) => (
                    <Route path={post.link} element={<Post date={post.date} title={post.title} content={post.content} />} />
                ))}                
            </Routes>
        </BrowserRouter>
    )
}

export default BlogLinks;