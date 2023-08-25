export const objectKeys = <T extends object, K = keyof T>(object: T) =>
  Object.keys(object) as Array<K>;
