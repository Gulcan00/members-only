import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { createUser } from '../db/queries';
export function signupGet(req, res) {
    res.render('signup');
}
export const signupPost = [
    body('firstName')
        .trim()
        .isAlpha()
        .withMessage('First name must only contain letters'),
    body('lastName')
        .trim()
        .isAlpha()
        .withMessage('Last name must only contain letters'),
    body('email').trim().isEmail().withMessage('Enter a valid email address'),
    body('password')
        .trim()
        .isStrongPassword()
        .withMessage('Password must be 8 or more characters and contain 1 lower case letter, 1 upper case letter, 1 number and 1 symbol'),
    body('passwordConfirmation')
        .trim()
        .custom((value, { req }) => {
        return value === req.body.password;
    })
        .withMessage('Passwords do not match'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('signup', {
                errors: errors.mapped(),
            });
        }
        else {
            const { firstName, lastName, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            createUser({ firstName, lastName, email, password: hashedPassword })
                .then(() => res.redirect('/login'))
                .catch(next);
        }
    },
];
