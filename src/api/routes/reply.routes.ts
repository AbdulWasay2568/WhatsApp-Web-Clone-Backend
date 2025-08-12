import { Router } from "express";
import {
  getRepliesController,
  createReplyController,
  getReplyController,
  deleteReplyController
} from "../controllers/reply.controller";

const replyRoutes: Router = Router();

replyRoutes.post('/', createReplyController);
replyRoutes.get('/message/:messageId', getRepliesController);
replyRoutes.get('/:id', getReplyController);
replyRoutes.delete('/:id', deleteReplyController);

export default replyRoutes;
