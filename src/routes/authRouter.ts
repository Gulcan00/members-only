import { Router } from 'express';
import { signupGet, signupPost, loginGet, loginPost, logoutGet } from '../controllers/authController';

const authRouter = Router();

authRouter.get('/sign-up', signupGet);
authRouter.post('/sign-up', signupPost);
authRouter.get('/log-in', loginGet);
authRouter.post('/log-in', loginPost);
authRouter.get('/log-out', logoutGet);

export default authRouter;
