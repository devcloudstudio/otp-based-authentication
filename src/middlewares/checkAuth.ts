import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { verifyJwtToken } from '../helpers/token'

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
            next({ status: 403, message: 'AUTH_HEADER_MISSING_ERR' })
            return
    }
    const token = header.split("Bearer ")[1];

    if (!token) {
      next({ status: 403, message: 'AUTH_TOKEN_MISSING_ERR' })
            return
    }

    const userId = verifyJwtToken(token, next);

    if (!userId) {
       next({ status: 403, message: 'JWT_DECODE_ERR' })
            return
    }

    const user = await User.findById(userId);

    if (!user) {
      next({status: 404, message: 'USER_NOT_FOUND_ERR' })
      return
    }

    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
