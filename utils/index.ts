export const arraify = <T>(target: T | T[]): T[] => {
  return Array.isArray(target) ? target : [target];
};

export const filterNullable = <T>(
  list: T[],
  isNullable?: (value: T) => boolean
): NonNullable<T>[] => {
  return list.filter((e) => {
    if (isNullable) {
      return isNullable(e);
    }
    return !!e;
  }) as NonNullable<T>[];
};

export const copyObject = <T extends Object>(obj: T) => {
  const ss = JSON.parse(JSON.stringify(obj));
  return ss as T;
};

export const jsonParseSafely = <T>(str?: string | null): T | undefined => {
  let res: T | undefined = undefined;
  try {
    res = JSON.parse(str || "");
  } catch (error) {}
  return res;
};
export * from "./tool-category";
