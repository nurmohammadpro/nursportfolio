import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // Add user ID to session for MongoDB queries
      if (session.user) {
        (session.user as any).role = user?.role || token?.role;
        (session.user as any).id = user?.id || token?.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
