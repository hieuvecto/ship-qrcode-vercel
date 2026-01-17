import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Get admin emails from environment
function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || "";
  return emails.split(",").map((email) => email.trim()).filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
  callbacks: {
    async signIn({ user }) {
      const adminEmails = getAdminEmails();
      const userEmail = user.email?.toLowerCase();

      // Check if user email is in admin list
      if (userEmail && adminEmails.includes(userEmail)) {
        return true;
      }

      // Deny access if not admin
      return false;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
