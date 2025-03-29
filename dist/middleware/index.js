import moment from 'moment';
export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/log-in');
    }
}
export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.is_admin) {
        next();
    }
    else {
        res.status(401).json({ mgs: 'You are not admin' }); // TODO replace with render error page
    }
}
export function setCurrentUser(req, res, next) {
    res.locals.currentUser = req.user;
    next();
}
export function momentLib(req, res, next) {
    res.locals.moment = moment;
    next();
}
