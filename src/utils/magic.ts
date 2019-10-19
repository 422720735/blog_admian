export function splitTags(str: string): string[] {
  const ay = str.split(',');
  ay.splice(ay.length - 1, 1);
  return ay;
}
