import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      const allowlist = ["kalva@adobe.com"];
      return allowlist.includes(token?.email as string);
    },
  },
});

export const config = { matcher: ["/admin/:path*"] };
