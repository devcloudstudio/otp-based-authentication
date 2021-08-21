import { Request, Response, NextFunction } from 'express'
import User from "../models/User";
import { Client } from "africastalking-ts";
import { generateOTP } from '../helpers/otp'
import { createJwtToken } from '../helpers/token'


const client = new Client({
  apiKey: process.env.apiKey,
  username: process.env.username,
});

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { phone, name } = req.body;

    const phoneExist = await User.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: "PHONE_EXISTS" });
      return;
    }

    const createUser = new User({
      phone,
      name,
      role: phone === process.env.ADMIN_NUMBER ? "ADMIN" : "USER",
    });

    const user = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "Account created OTP sent to mobile number",
      data: {
        userId: user._id,
      },
    });

    // generate OTP

    const otp = generateOTP(6);

    user.phoneOtp = otp;
    await user.save();

    // send otp to phoneNumber

    await client.sendSms({
      to: user.phone,
      message: `Your OTP is ${otp}`,
    });
  } catch (err) {
    next(err);
  }
};

// Login with phone otp

export const loginWithPhoneOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return;

    res.status(201).json({
      type: "Success",
      message: "OTP sent to your registered number",
      data: {
        userId: user._id,
      },
    });

    // generate OTP
    const otp = generateOTP(6);

    user.phoneOtp = otp;

    await user.save();

    await client.sendSms({
      to: user.phone,
      message: `Your OTP is ${otp}`,
    });
  } catch (err) {}
};

// verify phone otp

export const verifyPhoneOtp = async (req: Request,  res: Response, next: NextFunction) => {
  try {
    const { otp, userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      next({ status: 400, message: "USER NOT FOUNd" });
      return;
    }

    if (user.phoneOtp !== otp) {
      next({ status: 400, message: "INCORRECT OTP" });
      return;
    }

    const token = createJwtToken({ userId: user._id });

    user.phoneOtp = "";
    await user.save();

    res.status(200).json({
      type: "success",
      message: "otp verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const fetchCurrentUser = async (req: Request,  res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.user;

     res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const handleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.user;
     res.status(200).json({
      type: "success",
      message: "Ok you're admin",
      data: {
        user: currentUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
