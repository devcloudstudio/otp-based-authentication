import jwt from 'jsonwebtoken'


export const createJwtToken = (payload: any) => {
    const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "1d" });
    return token;
  };

export const verifyJwtToken = (token: any, next: any) => {
    try {
        //@ts-ignore
      const { userId } = jwt.verify(token, process.env.JWT_TOKEN);
      return userId;
    } catch (err) {
      next(err);
    }
  };