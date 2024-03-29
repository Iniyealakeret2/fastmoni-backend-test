import httpStatus from "http-status";
import { Request, Response, Router } from "express";

import AuthPolicy from "../policy/auth.policy";
import authRoute from "../routes/auth.routes";
import userRoute from "../routes/user.routes";

const router = Router();

/** GET /health-check - Check service health */
router.get("/health-check", (_req: Request, res: Response) =>
  res.status(httpStatus.OK).json({ check: "yemosei server started ok*-*" })
);

// mount Auth routes
router.use("/auth", authRoute);

/**
 * Check user access_token and authenticate user to perform HTTP requests
 * @description Validate the request, check if user is signed in and is authorized to perform this request
 */
router.use(AuthPolicy.hasAccessToken);

// mount User routes
router.use("/user", userRoute);

export default router;
