import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, openAPI } from "better-auth/plugins";
import { prisma } from "@mini-commerce/database";


export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000/api/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {}, 
  plugins: [
    openAPI(),
    admin({
      defaultRole: "CUSTOMER",
      adminRole: "ADMIN",
    }),
  ],
});

export async function getBetterAuthSchema() {
  return await auth.api.generateOpenAPISchema();

}
