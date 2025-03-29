import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDatabase from '../db/entities/UserDatabase';
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    UserDatabase.getUserByEmail({ email })
        .then((user) => {
        if (!user) {
            return done(null, false, {
                message: 'Incorrect email or password',
            });
        }
        bcrypt
            .compare(password, user.password)
            .then((match) => {
            if (!match) {
                return done(null, false, {
                    message: 'Incorrect email or password',
                });
            }
            return done(null, user);
        })
            .catch((err) => done(err));
    })
        .catch((err) => done(err));
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    UserDatabase.getById(id)
        .then((user) => {
        done(null, user);
    })
        .catch((err) => done(err));
});
export function signupGet(_req, res) {
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
            const user = await UserDatabase.getUserByEmail({ email });
            if (user) {
                res.render('signup', {
                    errors: { email: { msg: `User with email ${email} already exists` } },
                });
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                UserDatabase.createUser({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                })
                    .then(() => res.redirect('/log-in'))
                    .catch(next);
            }
        }
    },
];
export function loginGet(req, res) {
    if (req.session.messages?.length > 0) {
        const msg = req.session.messages[0];
        req.session.messages = [];
        return res.render('login', {
            errors: { password: { msg } },
        });
    }
    return res.render('login');
}
export const loginPost = [
    body('email').trim().isEmail().withMessage('Enter a valid email address'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                errors: errors.mapped(),
            });
        }
        else {
            next();
        }
    },
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/log-in',
        failureMessage: 'Incorrect email or password',
    }),
];
export function logoutGet(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/log-in');
    });
}
