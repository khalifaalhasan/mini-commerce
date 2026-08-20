import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@mini-commerce/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: ReturnType<typeof betterAuth<any>> = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "CUSTOMER",
      adminRole: "ADMIN",
    }),
  ],
});
