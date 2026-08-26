import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, openAPI } from "better-auth/plugins";
import { prisma } from "@mini-commerce/database";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
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
