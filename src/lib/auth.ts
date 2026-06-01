import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";

import { admin, createAccessControl, twoFactor } from "better-auth/plugins";

import { Resend } from "resend";
import { adminRole, userRole } from "./permission";

const resend = new Resend(`${process.env.RESEND_SECRET}`);


 

export const auth = betterAuth({
  appName: "Lab Equipment",
  baseURL:process.env.BETTER_AUTH_URL,
  basePath:"/api/v1/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.FRONTEND_URL!],

  // rateLimit:{
  //   enabled:true,
  //   window:60,
  //   max:2
  // },

  advanced:{
    cookiePrefix:"lablog"
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: `${process.env.FRONTEND_URL!}/api/auth/callback/github`,
    },
  },

  plugins: [
    admin({
      adminRoles:["admin","user"],
      defaultRole:"user",
      roles:{
        admin:adminRole,
        user:userRole
      }
    }),
    twoFactor({
      otpOptions: {

        period:2,
        async sendOTP({ user, otp }, ctx) {
          //   console.log(user, otp);
          console.log("OTP CALLBACK HIT");
          console.log(user.email);
          console.log(otp);

 
          // * send mail function

          try {
            const result = await resend.emails.send({
              from: "Acme <onboarding@resend.dev>",
              to: user.email,
              subject: "Verify OTP ",
              html: `<p>Your OTP is <strong>${otp}</strong></p>`,
            });

            console.log("result -> ", result);
          } catch (error) {
            console.log(error);
          }

        

        },
        
      },
    }),
  ],
});
