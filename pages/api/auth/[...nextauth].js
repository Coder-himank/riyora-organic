// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/server/db";
import User from "@/server/models/User";
import redis from "@/server/redis";

/**
 * NextAuth configuration for Phone-based OTP Authentication
 *
 * Flow:
 * 1. User submits country code, phone, OTP (and name if new user).
 * 2. OTP is validated against Redis (with atomic get and delete).
 * 3. If OTP is valid:
 *    - Existing user → mark as phoneVerified (if not already).
 *    - New user → create a record with phoneVerified = true.
 * 4. Session is created using JWT strategy.
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone OTP Login",
      credentials: {
        countryCode: { label: "Country Code", type: "text" },
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name (Signup only)", type: "text" }
      },
      async authorize(credentials) {
        await dbConnect();
        const { countryCode, phone, otp, name } = credentials;

        if (!countryCode || !phone || !otp) {
          throw new Error("Country code, phone, and OTP are required");
        }

        try {
          const otpKey = `otp:${countryCode}${phone}`;

          // Validate OTP
          const storedOtp = await redis.get(otpKey);
          await redis.del(otpKey); // ensure OTP cannot be reused

          if (!storedOtp) {
            throw new Error("OTP expired or not found");
          }
          if (storedOtp !== otp) {
            throw new Error("Invalid OTP");
          }

          let user = await User.findOne({ phone });

          // If user does not exist → create minimal profile
          if (!user) {
            if (!name) throw new Error("Name is required for signup");

            user = await User.create({
              name,
              phone,
              phoneVerified: true,
              enrolled: false // enrollment completed later
            });
          } else {
            // If user exists but not verified → verify
            if (!user.phoneVerified) {
              user.phoneVerified = true;
              await user.save();
            }
          }

          // Return sanitized user object for JWT/session
          return {
            id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            email: user.email || null,
            role: user.role,
            cartData : user.cartData || []
          };
        } catch (err) {
          console.error("OTP authorization error:", err);
          throw new Error("OTP validation failed");
        }
      }
    })
  ],

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Attach user details to the JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.email = user.email || user.phone;
        token.role = user.role || "user";
        token.cartData = user.cartData || [];
        
      }
      return token;
    },

    /**
     * Make JWT values available in the session object
    */
   async session({ session, token }) {
     if (!session.user) session.user = {};
     session.user.id = token.id;
     session.user.name = token.name;
     session.user.phone = token.phone;
     session.user.email = token.email;
     session.user.role = token.role;
     session.user.cartData = token.cartData || [];

      return session;
    }
  }
};

export default NextAuth(authOptions);