export function generateId(generator: Crypto = crypto): string {
  return generator.randomUUID();
}
