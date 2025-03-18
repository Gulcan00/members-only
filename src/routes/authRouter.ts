import { Router } from 'express';
import { signupGet, signupPost, loginGet, loginPost } from '../controllers/authController';

const authRouter = Router();

authRouter.get('/sign-up', signupGet);
authRouter.post('/sign-up', signupPost);
authRouter.get('/log-in', loginGet);
authRouter.post('/log-in', loginPost);

export default authRouter;
