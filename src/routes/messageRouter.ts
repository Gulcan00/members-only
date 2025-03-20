import { Router } from 'express';
import { createMessageGet, createMessagePost, getMessages } from '../controllers/messageController';

const messageRouter = Router();

messageRouter.get('/', getMessages);
messageRouter.get('/create-message', createMessageGet);
messageRouter.post('/create-message', createMessagePost);

export default messageRouter;