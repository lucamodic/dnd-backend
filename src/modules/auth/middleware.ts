import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type AuthorizationHeaderValue =
  | string
  | Express.AuthorizationContext
  | undefined;

const unauthorized = (res: Response, message = "Unauthorized") => {
  return res.status(401).json({ error: message });
};

const normalizeHeader = (
  value: AuthorizationHeaderValue
): {
  raw: string;
  scheme: string;
  token: string;
  claims?: Express.AuthorizationClaims;
} | null => {
  if (!value) return null;

  if (typeof value !== "string") {
    return value;
  }

  const raw = value.trim();
  if (!raw) return null;

  const [maybeScheme, tokenCandidate] = raw.split(" ");
  if (tokenCandidate) {
    return { raw, scheme: maybeScheme, token: tokenCandidate };
  }

  return { raw, scheme: "Bearer", token: raw };
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const header = normalizeHeader(req.headers.authorization);
  if (!header?.token) {
    return unauthorized(res, "Missing authorization token");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  try {
    const claims =
      header.claims ??
      (jwt.verify(header.token, secret) as Express.AuthorizationClaims);

    req.authorization = {
      raw: header.raw,
      scheme: header.scheme,
      token: header.token,
      claims,
    };

    return next();
  } catch (error) {
    console.error("[requireAuth] Failed to verify token:", error);
    return unauthorized(res, "Invalid or expired token");
  }
};
