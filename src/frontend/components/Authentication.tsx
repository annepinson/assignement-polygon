import React, { ReactNode } from 'react';
import { useSession, signIn } from 'next-auth/react';

type Props = {
  children: ReactNode;
};

const Authentication: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (session) {
    return <div className="auth">{props.children}</div>;
  } else {
    return (
      <>
        {' '}
        Not signed in <br /> <button onClick={() => signIn()}>
          Sign in
        </button>{' '}
      </>
    );
  }
};

export default Authentication;
