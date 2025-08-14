import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/server/db";
import User from "@/server/models/User";
import redis from "@/server/redis";
import bcrypt from "bcryptjs";
import axios from "axios";

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

          // Atomically get and delete OTP
          const storedOtp = await redis.get(otpKey);
          await redis.del(otpKey);

          if (!storedOtp) {
            return res.status(400).json({ success: false, message: "OTP expired or not found" });
          }

          if (storedOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
          }
          console.log("OTP MATCHED");

          let user = await User.findOne({ phone });

          if (!user) {
            if (!name) throw new Error("Name is required for signup");

            user = await User.create({
              name,
              phone,
              phoneVerified: true,
              enrolled: false // Let signup completion happen later
            });
          } else {
            if (!user.phoneVerified) {
              user.phoneVerified = true;
              await user.save();
            }

            // if (!user.enrolled) {
            //   throw new Error("Enrollment not finished");
            // }
          }

          return {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email || null,
            role: user.role
          };
        }
        catch (err) {
          throw new Error("Otp invalid " + err)
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.phone = token.phone;
      return session;
    }
  }
};

export default NextAuth(authOptions);
