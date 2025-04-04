import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import MessageDatabase from '../db/entities/MessageDatabase';
import { User } from '../db/models';

export async function getMessages(req: Request, res: Response) {
  const messages = await MessageDatabase.getAllMessages();
  res.render('index', { messages });
}

export async function createMessageGet(req: Request, res: Response) {
  res.render('message-form');
}

export const createMessagePost = [
  body('title')
    .trim()
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Title must only contain letters and numbers'),
  body('body').optional().trim().isEmpty().withMessage('Body cannot be empty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('message-form', { errors: errors.mapped() });
    }

    const { title, body } = req.body;
    const user = req.user as User;
    MessageDatabase.createMessage({ title, body, userId: user.id })
      .then(() => res.redirect('/'))
      .catch(next);
  },
];

export function deleteMessage(req: Request, res: Response, next: NextFunction) {
  const id = Number.parseInt(req.params.id);
  MessageDatabase.deleteById(id)
    .then(() => res.redirect('/'))
    .catch((err) => next(err));
}
