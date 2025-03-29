import { body, validationResult } from 'express-validator';
import MessageDatabase from '../db/entities/MessageDatabase';
export async function getMessages(req, res) {
    const messages = await MessageDatabase.getAllMessages();
    res.render('index', { messages });
}
export async function createMessageGet(req, res) {
    res.render('message-form');
}
export const createMessagePost = [
    body('title')
        .trim()
        .isAlphanumeric('en-US', { ignore: ' ' })
        .withMessage('Title must only contain letters and numbers'),
    body('body').optional().trim().isEmpty().withMessage('Body cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('message-form', { errors: errors.mapped() });
        }
        const { title, body } = req.body;
        const user = req.user;
        MessageDatabase.createMessage({ title, body, userId: user.id })
            .then(() => res.redirect('/'))
            .catch(next);
    },
];
export function deleteMessage(req, res, next) {
    const id = Number.parseInt(req.params.id);
    MessageDatabase.deleteById(id)
        .then(() => res.redirect('/'))
        .catch((err) => next(err));
}
