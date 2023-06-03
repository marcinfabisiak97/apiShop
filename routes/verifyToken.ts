import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: any;
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader: string | undefined = req.headers.token as
    | string
    | undefined;

  if (authHeader && process.env.JWT_SECRET !== undefined) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
      if (err) res.status(403).json("Token is invalid");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authorized");
  }
};
const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to that");
    }
  });
};
const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to that");
    }
  });
};
export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
