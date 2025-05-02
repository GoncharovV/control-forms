export function copyObject<TObject extends object>(obj: TObject): TObject {
  // TODO: Maybe structuredClone() or smt else?
  return { ...obj };
}
