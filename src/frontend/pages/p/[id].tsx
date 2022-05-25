import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { PostProps } from '../../components/Post';
import Authentication from '../../components/Authentication';
import { useSession } from 'next-auth/react';
import Comment from '../../components/Comment';

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
  const { data: session } = useSession();
  // An user can delete or publish a post if and only if he has written it.
  const userIsAuthor = session?.user.email == props?.author?.email;

  return (
    <Layout>
      <Authentication>
        <div>
          <h2>{title}</h2>
          <p>By {props?.author?.name || 'Unknown author'}</p>
          <ReactMarkdown children={props.content} />
          {!props.published && userIsAuthor && (
            <button onClick={() => publish(props.id)}>Publish</button>
          )}
          {userIsAuthor && (
            <button onClick={() => destroy(props.id)}>Delete</button>
          )}
          {props.comments &&
            props.comments.map((comment) => <Comment comment={comment} />)}
        </div>
        <style jsx>{`
          .page {
            background: white;
            padding: 2rem;
          }

          .actions {
            margin-top: 2rem;
          }

          button {
            background: #ececec;
            border: 0;
            border-radius: 0.125rem;
            padding: 1rem 2rem;
          }

          button + button {
            margin-left: 1rem;
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
