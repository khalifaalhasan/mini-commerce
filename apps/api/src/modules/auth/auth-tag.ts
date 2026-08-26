export function tagAuthPaths(paths: Record<string, any>, tagName: string) {
  const tagged: Record<string, any> = {};
  for (const [path, methods] of Object.entries(paths)) {
    tagged[path] = {};
    for (const [method, operation] of Object.entries(methods as Record<string, any>)) {
      tagged[path][method] = {
        ...operation,
        tags: [tagName],
      };
    }
  }
  return tagged;
}