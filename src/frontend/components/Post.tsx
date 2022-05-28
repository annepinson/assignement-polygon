import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Comment from './Comment';
import { useSession } from 'next-auth/react';
import { trigger } from 'polyrhythm';
import { WebsocketService } from './WebsocketService';

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
  const [addComment, setAddComment] = useState(false);
  const [content, setContent] = useState('');
  const [isTyping, setTyping] = useState(false);
  const { data: session } = useSession();
  const userEmail = session.user?.email;
  const router = useRouter();

  const submitComment = async () => {
    try {
      const body = { content, userEmail, postId: post.id };
      await fetch(`http://localhost:3001/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
      setAddComment(false);
      setContent('');
      trigger(`message/create/${post.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <div onClick={() => Router.push('/p/[id]', `/p/${post.id}`)}>
          <h2>{post.title}</h2>
          <small>By {authorName}</small>
          <ReactMarkdown children={post.content} />
        </div>
        <div className="buttons-div">
          {post.comments.length > 0 && (
            <button
              className="button"
              onClick={() => setShowComments(!showComments)}
            >
              Show Comments
            </button>
          )}
          {post.published && (
            <button
              className="button"
              onClick={() => setAddComment(!addComment)}
            >
              Add a comment
            </button>
          )}
        </div>
        {post.comments &&
          showComments &&
          post.comments.map((comment) => <Comment comment={comment} />)}
        {addComment && (
          <>
            <textarea
              cols={50}
              onChange={(e) => {
                setContent(e.target.value);
                trigger(`message/edit/${post.id}`);
              }}
              placeholder="Your comment..."
              rows={8}
              value={content}
            />
            <button className="button" onClick={() => submitComment()}>
              Publish your comment
            </button>
          </>
        )}
        {isTyping && (
          <div className="currently-typing-wrapper">
            <div className="container-dot">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>
      <WebsocketService
        postId={post.id}
        setTyping={setTyping}
        router={router}
      />
      <style jsx>{`
        div {
          color: inherit;
          padding: 1rem;
        }

        .button-div {
          display: flex;
        }

        .button {
          background-color: white;
          color: black;
          border: none;
          padding: 12px 28px;
          font-size: 16px;
          border-radius: 4px;
          border: 2px solid #e7e7e7;
          margin: 1rem;
          transition-duration: 0.4s;
        }

        .button:hover {
          background-color: #e7e7e7;
        }

        .currently-typing-wrapper {
          background: #e6e6e6;
          padding: 12px 28px;
          display: inline-flex;
          width: 20%;
          flex-direction: row;
          border-radius: 8px;
          align-content: center;
          justify-items: center;
          height: 50px;
        }

        .container-dot {
          padding-left: 15px;
          display: inline-block;
        }
        .dot {
          height: 10px;
          width: 10px;
          border-radius: 100%;
          display: inline-block;
          background-color: #b4b5b9;
          animation: 1.2s typing-dot ease-in-out infinite;
        }
        .dot:nth-of-type(2) {
          animation-delay: 0.15s;
        }
        .dot:nth-of-type(3) {
          animation-delay: 0.25s;
        }
        @keyframes typing-dot {
          15% {
            transform: translateY(-35%);
            opacity: 0.5;
          }
          30% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Post;
