import {usePost} from '@/hooks/use-post';
import React, {useEffect, useRef} from 'react';

interface PostProps {
  params: {
    postId: string;
  };
}

const Post = ({params}: PostProps) => {
  return <div className="container mx-auto"></div>;
};

export default Post;
