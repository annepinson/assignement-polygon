import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import Router, { useRouter } from 'next/router';
import { PostProps } from '../../components/Post';
import Authentication from '../../components/Authentication';
import { useSession } from 'next-auth/react';
import Comment from '../../components/Comment';
import Link from 'next/link';

async function publish(id: number): Promise<void> {
  await fetch(`http://localhost:3001/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function destroy(id: number): Promise<void> {
  await fetch(`http://localhost:3001/post/${id}`, {
    method: 'DELETE',
  });
  await Router.push('/');
}

const Post: React.FC<PostProps> = (props) => {
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }
  const [addComment, setAddComment] = useState(false);
  const [content, setContent] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  // An user can delete or publish a post if and only if he has written it.
  const userIsAuthor = session?.user.email == props?.author?.email;

  const submitComment = async () => {
    try {
      const body = {
        content,
        userEmail: session?.user.email,
        postId: props.id,
      };
      await fetch(`http://localhost:3001/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await router.reload();
      setAddComment(false);
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Authentication>
        <div>
          <h2>{title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          <ReactMarkdown children={props.content} />
          {!props.published && userIsAuthor && (
            <button className="button" onClick={() => publish(props.id)}>
              Publish
            </button>
          )}
          {userIsAuthor && (
            <button className="button" onClick={() => destroy(props.id)}>
              Delete
            </button>
          )}
          {props.published && (
            <Link href="#comment-down">
              <button
                className="button"
                onClick={() => setAddComment(!addComment)}
                ref="#comment-down"
              >
                Add a comment
              </button>
            </Link>
          )}
          {props.comments &&
            props.comments.map((comment) => <Comment comment={comment} />)}
          {addComment && (
            <div id="comment-down">
              <textarea
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your comment..."
                rows={8}
                value={content}
              />
              <button className="button" onClick={() => submitComment()}>
                Publish your comment
              </button>
            </div>
          )}
        </div>
        <style jsx>{`
          .page {
            background: white;
            padding: 2rem;
          }

          .actions {
            margin-top: 2rem;
          }

          .button + .button {
            margin-left: 1rem;
          }

          .button {
            background-color: #e7e7e7;
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
            background-color: white;
          }
        `}</style>
      </Authentication>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3001/post/${context.params.id}`);
  const data = await res.json();
  return { props: { ...data } };
};

export default Post;
