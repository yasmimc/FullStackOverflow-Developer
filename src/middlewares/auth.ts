import { Request, Response } from 'express';
import { validateUserAuthentication } from '../controllers/userController';
export default async function authenticate(
    req: Request,
    res: Response,
    next: Function
) {
    await validateUserAuthentication(req, res);
    if (res.locals.user) {
        next();
    }
}
