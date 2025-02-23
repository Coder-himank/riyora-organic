import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/server/db";
import User from "@/server/models/User";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Phone", type: "text", placeholder: "user@example.com" },
        // password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          const user = await User.findOne({
            $or: [{ email: credentials.email }, { phone: credentials.email }],
          });

          if (!user) {
            throw new Error("User not found");
          }

          // const isMatch = await bcrypt.compare(credentials.password, user.password);
          // if (!isMatch) {
          //   throw new Error("Invalid credentials");
          // }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Auth Error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});
