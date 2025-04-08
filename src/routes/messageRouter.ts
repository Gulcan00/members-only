import { Router } from 'express';
import { createMessageGet, createMessagePost, deleteMessage, getMessages } from '../controllers/messageController.js';

const messageRouter = Router();

messageRouter.get('/', getMessages);
messageRouter.get('/create', createMessageGet);
messageRouter.post('/create', createMessagePost);
messageRouter.post('/delete/:id', deleteMessage);

export default messageRouter;