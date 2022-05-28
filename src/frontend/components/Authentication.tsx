import React, { ReactNode } from 'react';
import { useSession, signIn } from 'next-auth/react';

type AuthProps = {
  children: ReactNode;
};

const Authentication: React.FC<AuthProps> = (props) => {
  const { data: session } = useSession();

  if (session) {
    return <div className="auth">{props.children}</div>;
  } else {
    return (
      <>
        {' '}
        Not signed in <br />{' '}
        <button className="button" onClick={() => signIn()}>
          Sign in
        </button>{' '}
        <style jsx>{`
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
        `}</style>
      </>
    );
  }
};

export default Authentication;
