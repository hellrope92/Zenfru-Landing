import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
