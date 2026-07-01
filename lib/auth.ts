import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { recordLogin } from "./analytics";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Admin bypass — password-only, no Google account needed.
    CredentialsProvider({
      id: "admin-password",
      name: "Admin",
      credentials: { password: { label: "Admin password", type: "password" } },
      authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) return null;
        if (credentials?.password !== adminPassword) return null;
        return { id: "admin", name: "Admin", email: "admin@local", isAdmin: true } as any;
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  events: {
    async signIn({ user, account }) {
      const userId = account?.providerAccountId ?? user.id;
      if (userId) {
        await recordLogin({ id: userId, name: user.name, email: user.email, image: user.image });
      }
    },
  },
  callbacks: {
    jwt({ token, account, user }) {
      if (account) token.sub = account.providerAccountId;
      if ((user as any)?.isAdmin) {
        token.isAdmin = true;
        token.sub = "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        (session.user as any).isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },
};
