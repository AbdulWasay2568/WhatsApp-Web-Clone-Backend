import express from 'express';
import { upload } from '../middlewares/upload';
import { uploadController } from '../controllers/upload.controller';

const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('file'), uploadController);

export default uploadRouter;
