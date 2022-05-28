import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

interface Credentials {
  email: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
      },
      async authorize(credentials: Credentials): Promise<User | null> {
        const res = await fetch(`http://localhost:3001/session`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
});
