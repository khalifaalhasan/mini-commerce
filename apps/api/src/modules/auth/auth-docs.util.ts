import { OpenAPIObject } from "@nestjs/swagger";
import { getBetterAuthSchema } from "./auth.config";
import { tagAuthPaths } from "./auth-tag";

export async function mergeAuthDocs(
  nestDocument: OpenAPIObject,
): Promise<OpenAPIObject> {
  const authSchema = (await getBetterAuthSchema()) as unknown as OpenAPIObject;
  const prefixedPaths: Record<string, any> = {};

  if (authSchema && authSchema.paths) {
    Object.entries(authSchema.paths).forEach(([path, pathItem]) => {
      const newPath = `/auth${path}`;
      prefixedPaths[newPath] = pathItem;
    });
  }

  return {
    ...nestDocument,
    paths: {
      ...nestDocument.paths,
      ...tagAuthPaths(prefixedPaths, 'Auth')
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