import 'express-session';
import { User } from '../db/models';

declare module 'express-session' {
interface Session {
  user: User;
  messages: string[];
 }
}