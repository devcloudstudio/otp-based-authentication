import { Router } from "express";
import {createNewUser, loginWithPhoneOtp, verifyPhoneOtp, fetchCurrentUser, handleAdmin }  from '../controllers/authController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkAdmin } from '../middlewares/checkAdmin'


const router = Router()

router.post("/register", createNewUser);

router.post("/login_with_phone", loginWithPhoneOtp);

router.post("/verify", verifyPhoneOtp);

router.get("/me", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

export default router;
