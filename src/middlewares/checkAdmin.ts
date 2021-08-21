import { Request, Response, NextFunction }from 'express'

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const currentUser = res.locals.user;

  if (!currentUser) {
    return next({ status: 401, message: "ACCESS_DENIED" });
  }

  if (currentUser.role === "admin") {
    return next();
  }

  return next({ status: 401, message: "ACCESS_DENIED" });
};
