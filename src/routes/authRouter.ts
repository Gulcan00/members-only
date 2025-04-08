import { Router } from 'express';
import {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutGet,
  verifyMember,
  verifyAdmin,
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.get('/sign-up', signupGet);
authRouter.post('/sign-up', signupPost);
authRouter.get('/log-in', loginGet);
authRouter.post('/log-in', loginPost);
authRouter.get('/log-out', logoutGet);
authRouter.post('/become-member', verifyMember);
authRouter.post('/become-admin', verifyAdmin);

export default authRouter;
