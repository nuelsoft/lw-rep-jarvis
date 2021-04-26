import jwt from "jsonwebtoken";
import props from "src/properties";

export function create<T extends object>(payload: T, options: jwt.SignOptions = {}): string {
  return jwt.sign(payload as T, props.secrets.jwt, {
    ...options,
    issuer: "web-service",
  });
}

export function decode<T extends object>(token: string): T | null {
  try {
    return jwt.verify(token, props.secrets.jwt) as T;
  } catch (e) {
    console.error(e)
    return null;
  }
}
