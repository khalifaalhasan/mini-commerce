import { OpenAPIObject } from "@nestjs/swagger";
import { getBetterAuthSchema } from "./auth.config";
import { tagAuthPaths } from "./auth-tag";

export async function mergeAuthDocs(
  nestDocument: OpenAPIObject,
): Promise<OpenAPIObject> {
  const authSchema = (await getBetterAuthSchema()) as unknown as OpenAPIObject;

  return {
    ...nestDocument,
    paths: {
      ...nestDocument.paths,
      ...tagAuthPaths(authSchema.paths, 'Auth')
    },
    components: {
      ...nestDocument.components,
      schemas: {
        ...nestDocument.components?.schemas,
        ...authSchema.components?.schemas,
      },
    },
  };
}