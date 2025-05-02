export const mergeArrays = <T>(arrays: T[][]): T[] => {
  return new Array<T>().concat(...arrays);
};
