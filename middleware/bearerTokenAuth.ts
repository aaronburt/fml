import { Request, Response, NextFunction } from "express";

export function bearerTokenAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - no or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const validToken = "PLACEHOLDER_TOKEN";

    if (token !== validToken) {
      return res.status(401).json({ error: "Unauthorized - invalid token" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Internal error during token validation",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}