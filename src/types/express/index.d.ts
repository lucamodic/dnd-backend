import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface AuthorizationClaims extends JwtPayload {
      id?: string;
    }

    interface AuthorizationContext {
      raw: string;
      scheme: string;
      token: string;
      claims: AuthorizationClaims;
    }

    interface Request {
      authorization?: AuthorizationContext;
    }
  }
}

declare module "http" {
  interface IncomingHttpHeaders {
    authorization?: string | Express.AuthorizationContext;
  }
}

export {};
