
interface PostProps {
    params: {
        postID: string;
    }
}
const Post = ({ params }: PostProps) => {
    return (
        <>
            {params.postID}
        </>
    );
}

export default Post;