import { Router } from "express";
import {
  fetchUsersController,
  createUserController,
  readUserController,
  updateUserController,
  deleteUserController
} from "../controllers/user.controller";

const userRoutes: Router = Router();

userRoutes.get('/', fetchUsersController);
userRoutes.post('/', createUserController);
userRoutes.get('/:id', readUserController);
userRoutes.put('/:id', updateUserController);
userRoutes.delete('/:id', deleteUserController);

export default userRoutes;
