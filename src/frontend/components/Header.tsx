import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session } = useSession();

  return (
    <nav>
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Blog
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive('/drafts')}>Drafts</a>
        </Link>
      </div>
      <div className="right">
        {session ? (
          <button className="button" onClick={() => signOut()}>
            SignOut
          </button>
        ) : (
          <Link href="/signup">
            <a className="button" data-active={isActive('/signup')}>
              Signup
            </a>
          </Link>
        )}
        <Link href="/create">
          <a className="button" data-active={isActive('/create')}>
            + Create draft
          </a>
        </Link>
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
        }

        a + a {
          margin-left: 1rem;
        }

        .right {
          margin-left: auto;
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
      `}</style>
    </nav>
  );
};

export default Header;
