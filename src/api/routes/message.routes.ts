import { Router } from "express";
import {
  fetchMessagesController,
  createMessageController,
  readMessageController,
  updateMessageController,
  deleteMessageController,
  getMessagesBetweenUsers
} from "../controllers/message.controller";

const messageRoutes: Router = Router();

messageRoutes.get('/', fetchMessagesController);
messageRoutes.post('/', createMessageController);
messageRoutes.get('/:id', readMessageController);
messageRoutes.put('/:id', updateMessageController);
messageRoutes.delete('/:id', deleteMessageController);


messageRoutes.get('/:userId1/:userId2', getMessagesBetweenUsers);

export default messageRoutes;
