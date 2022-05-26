import React from 'react';
import ReactMarkdown from 'react-markdown';

export type CommentProps = {
  content: string;
  author: {
    name: string;
  };
};

const Comment: React.FC<{ comment: CommentProps }> = ({ comment }) => {
  const authorName = comment.author ? comment.author.name : 'Unknown author';
  return (
    <div>
      <ReactMarkdown children={comment.content} />
      <small> By {authorName}</small>
      <style jsx>{`
        div {
          color: inherit;
          padding: 1rem;
          border: 2px solid #55555;
          background-color: #e7e7e7;
          margin: 2rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Comment;
