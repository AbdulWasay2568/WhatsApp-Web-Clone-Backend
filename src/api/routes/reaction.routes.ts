import { Router } from "express";
import {
  fetchReactionsController,
  createReactionController,
  deleteReactionController
} from "../controllers/reaction.controller";

const reactionRoutes: Router = Router();

reactionRoutes.get('/', fetchReactionsController);
reactionRoutes.post('/', createReactionController);
reactionRoutes.delete('/:id', deleteReactionController);

export default reactionRoutes;
