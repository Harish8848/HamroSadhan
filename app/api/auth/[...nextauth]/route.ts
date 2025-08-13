import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.NEXTAUTH_BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!res.ok) {
            return null;
          }

          const user = await res.json();
          if (user) {
            return user as User;
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT & { id?: string; role?: string | null }; user?: User }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role ?? undefined
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT & { id?: string; role?: string | null } }) {
      if (token) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role ?? undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST, authOptions };
