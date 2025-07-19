import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
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

          console.log("Authorize response status:", res.status)
          const data = await res.json();
          console.log("Authorize response data:", data)

          if (!res.ok) {
            // Throw an error with the message from the API response
            throw new Error(data.error || "Login failed");
          }

          if (data) {
            return data as User;
          }

          return null;
        } catch (error: any) {
          console.error("Authorize error:", error);
          // Map backend error message to NextAuth error code for login page
          if (error.message === "Invalid email or password") {
            throw new Error("CredentialsSignin");
          }
          throw new Error(error.message || "Login failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
      async jwt({ token, user }: { token: JWT; user?: User }) {
        console.log("NextAuth jwt callback token before:", token)
        if (user) {
          token.id = (user as any).id
          token.role = (user as any).role
          token.full_name = (user as any).full_name || (user as any).name || null;
          token.phone = (user as any).phone || null;
        }
        console.log("NextAuth jwt callback token after:", token)
        return token
      },
      async session({ session, token }: { session: Session; token: JWT }) {
        console.log("NextAuth session callback session before:", session)
        if (token) {
          (session.user as any).id = (token as any).id
          (session.user as any).role = (token as any).role
          (session.user as any).full_name = (token as any).full_name || null;
          (session.user as any).name = (token as any).full_name || null;
          (session.user as any).phone = (token as any).phone || null;
        }
        console.log("NextAuth session callback session after:", session)
        return session
      }
  },
  pages: {
    signIn: "/login",
    error: "/login" // Error code passed in query string as ?error=
  }
}

export default NextAuth(authOptions)
