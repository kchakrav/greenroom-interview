import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ token }) {
      // Any valid session (Google or admin password) gets through.
      return !!token;
    },
  },
});

// Protect everything except the login page and NextAuth API routes.
export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
