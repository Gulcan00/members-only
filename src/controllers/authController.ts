import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { createUser, getUserByEmail, getUserById } from '../db/queries';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../db/models';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
  }, (req, email, password, done) => {
  getUserByEmail({email})
  .then(user => {
    req.session.messages = [];
    if (!user) {
      return done(null, false, {message: 'Incorrect email or password'});
    }

    bcrypt.compare(password, user.password)
      .then(match => {
         if (!match) {
          return done(null, false, {message: 'Incorrect email or password'});
         }
         return done(null, user);
      })
      .catch((err) => done(err));
  })
  .catch((err) => done(err))
}));

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser((id: number, done) => {
  getUserById({id})
  .then(user => {
    done(null, user);
  })
  .catch(err => done(err));
})

export function signupGet(req: Request, res: Response) {
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
    .withMessage(
      'Password must be 8 or more characters and contain 1 lower case letter, 1 upper case letter, 1 number and 1 symbol'
    ),
  body('passwordConfirmation')
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match'),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('signup', {
        errors: errors.mapped(),
      });
    } else {
      const { firstName, lastName, email, password } = req.body;
      const user = await getUserByEmail({email});
      if (user)  {
        res.render('signup', {
          errors: {email: {msg: `User with email ${email} already exists`}}
        })
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        createUser({ firstName, lastName, email, password: hashedPassword })
          .then(() => res.redirect('/log-in'))
          .catch(next);
      }
    }
  },
];

export function loginGet(req: Request, res: Response) {
  if (req.session.messages) {
    res.render('login', {
      errors: {password: {msg: req.session.messages[0]}}
    });
  }
  res.render('login');
}

export const loginPost = [
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('login', {
        errors: errors.mapped(),
      });
    } else {
      next();
    }
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureMessage: 'Incorrect email or password'
  })
];

export function logoutGet(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/log-in');
  });
}