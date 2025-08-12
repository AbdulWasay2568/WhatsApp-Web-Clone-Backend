import { Router } from "express";
import {
  fetchCallsController,
  createCallController,
  readCallController,
  updateCallController,
  deleteCallController
} from "../controllers/call.controller";

const callRoutes: Router = Router();

callRoutes.get('/', fetchCallsController);
callRoutes.post('/', createCallController);
callRoutes.get('/:id', readCallController);
callRoutes.put('/:id', updateCallController);
callRoutes.delete('/:id', deleteCallController);

export default callRoutes;
