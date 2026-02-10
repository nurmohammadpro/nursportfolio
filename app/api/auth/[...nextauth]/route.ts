import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import dbConnect from "@/app/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({
          email: credentials?.email?.toLowerCase(),
        });

        if (!user || !user.password)
          throw new Error("No user found with this email");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password,
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "USER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // During initial login, 'user' is the object from your MongoDB/Adapter
      if (user) {
        token.id = user.id;

        if (account?.provider === "google" || account?.provider === "oauth") {
          await dbConnect();

          // Auto-assign Admin role for your email
          const role = user.email === "nurprodev@gmail.com" ? "ADMIN" : "USER";

          // Create user if doesn't exist, or update role if needed
          const dbUser = await User.findOneAndUpdate(
            { email: user.email },
            {
              name: user.name,
              email: user.email,
              image: user.image,
              role: role,
              emailVerified: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          token.role = dbUser?.role || "USER";
        } else {
          token.role = (user as any).role || "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      // This transfers the role from the encrypted JWT to the live session object
      if (session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
