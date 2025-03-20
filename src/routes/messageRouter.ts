import { Router, Request, Response } from 'express';

const messageRouter = Router();

messageRouter.get('/', (req: Request, res: Response) => {
    res.render('index');
});

export default messageRouter;