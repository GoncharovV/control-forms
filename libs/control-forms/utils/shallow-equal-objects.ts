export function shallowEqualObjects(
  a: Record<string, any>,
  b: Record<string, any> | undefined,
): boolean {
  if (!b || Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
