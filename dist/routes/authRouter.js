import { Router } from 'express';
import { signupGet, signupPost } from '../controllers/authController';
const authRouter = Router();
authRouter.get('/sign-up', signupGet);
authRouter.post('/sign-up', signupPost);
export default authRouter;
