import { Router } from "express";
import { registerUserController, loginUserController } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);

export default authRouter;

