
interface PostProps {
    params: {
        blogName: string;
    }
}
const Post = ({ params }: PostProps) => {
    return (
        <>
            {params.blogName}
        </>
    );
}

export default Post;