import PostCard from "@/components/PostCard";

const Posts = ({ posts }) => {
    return (
        <>
            <section className="flex flex-row justify-center p-10">
                <p className="mt-1 text-base text-gray-500">{`Things I\'ve written.`}</p>
            </section>

            <section className="grid gap-5 grid-col-1 md:grid-cols-1 lg:grid-cols-3">
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </section>
        </>
    );
}

export default Posts;