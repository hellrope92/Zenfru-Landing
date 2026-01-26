import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise, { dbName } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("=== Auth attempt started ===");
          
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials");
            return null;
          }

          console.log("Attempting to authenticate:", credentials.email);
          console.log("Database name:", dbName);

          const client = await clientPromise;
          const db = client.db(dbName);
          
          console.log("Connected to MongoDB");
          
          // First, try to find ALL users to debug
          const allUsers = await db.collection("users").find({}).toArray();
          console.log("Total users in database:", allUsers.length);
          console.log("User emails:", allUsers.map(u => u.email));
          
          // Find user by email (case-insensitive)
          const user = await db.collection("users").findOne({
            email: credentials.email.toLowerCase()
          });

          if (!user) {
            console.error("User not found for email:", credentials.email.toLowerCase());
            console.log("Available emails:", allUsers.map(u => u.email));
            return null;
          }

          console.log("User found:", user.email);

          if (!user.password) {
            console.error("User has no password");
            return null;
          }

          console.log("Password hash exists, length:", user.password.length);
          console.log("Comparing password...");

          // Check password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.error("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("✓ Authentication successful for:", credentials.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("!!! Authentication error:", error);
          console.error("Error details:", error instanceof Error ? error.stack : error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
