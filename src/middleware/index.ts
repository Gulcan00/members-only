import { Request, Response, NextFunction } from "express";
import moment from 'moment';
import { User } from "../db/models";


export function isAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/log-in');
    }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated() && (req.user as User).is_admin) {
        next();
    } else {
        res.status(401).json({mgs: 'You are not admin'}); // TODO replace with render error page
    }
}

export function setCurrentUser(req: Request, res: Response, next: NextFunction) {
    res.locals.currentUser = req.user;
    next();
}
moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s:  '1s',
      ss: '%ss',
      m:  '1m',
      mm: '%dm',
      h:  '1h',
      hh: '%dh',
      d:  '1d',
      dd: '%dd',
      M:  '1M',
      MM: '%dM',
      y:  '1Y',
      yy: '%dY'
    }
});
export function momentLib(req: Request, res: Response, next: NextFunction) {
    res.locals.moment = moment;
    next();
}