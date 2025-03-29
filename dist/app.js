import 'dotenv/config';
import express from 'express';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pool from './db/pool';
import authRouter from './routes/authRouter';
import { isAuth, setCurrentUser, momentLib } from './middleware';
import messageRouter from './routes/messageRouter';
const pgSessionStore = pgSession(session);
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    store: new pgSessionStore({
        pool,
        createTableIfMissing: true,
    }),
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use('/', authRouter);
app.use(isAuth);
app.use(setCurrentUser);
app.use(momentLib);
app.get('/', (req, res) => {
    res.redirect('/messages');
});
app.use('/messages', messageRouter);
app.use('*', (req, res) => {
    res.render('error', { message: 'Page not found' });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
// Error Handling
app.use(((err, req, res, next) => {
    res.status(err.status || 500).render('error', { message: err.message });
}));
