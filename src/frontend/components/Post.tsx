import React, { useState } from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import Comment from './Comment';

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  };
  content: string;
  published: boolean;
  comments: [
    {
      content: string;
      author: {
        name: string;
        email: string;
      };
    },
  ];
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <div onClick={() => Router.push('/p/[id]', `/p/${post.id}`)}>
        <h2>{post.title}</h2>
        <small>By {authorName}</small>
        <ReactMarkdown children={post.content} />
        <style jsx>{`
          div {
            color: inherit;
            padding: 2rem;
          }
        `}</style>
      </div>
      {post.comments.length > 0 && (
        <button onClick={() => setShowComments(!showComments)}>
          Show Comments
        </button>
      )}
      {post.comments &&
        showComments &&
        post.comments.map((comment) => <Comment comment={comment} />)}
    </>
  );
};

export default Post;
