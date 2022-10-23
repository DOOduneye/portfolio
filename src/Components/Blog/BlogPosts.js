import Post from "./Post";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import {BrowserRouter} from "react-router-dom";

function BlogPosts(post) {
    return (
        <main className="grid grid-flow-row auto-rows-max h-full w-full">
            <section>
                <Navigation />
            </section>

            <section className="flex flex-col justify-center items-center">
                <Post date={post.date} title={post.title} content={post.content} />
            </section>
        </main>
    );
}
