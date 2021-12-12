import { Request, Response } from 'express';
import AuthError from '../errors/AuthError';
import User from '../protocols/User';
import * as userService from '../services/userService';
import { usersSchema } from '../validations/schemas';

async function registerUser(req: Request, res: Response): Promise<Response> {
    try {
        const newUser: User = req.body;

        const validation = usersSchema.validate(newUser);
        if (validation.error) {
            return res.sendStatus(400);
        }

        const registeredUser = await userService.createUser(newUser);
        return res.send(registeredUser);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function validateUserAuthentication(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const { authorization } = req.headers;
        const token = authorization.replace('Bearer ', '');
        const user = await userService.findUserByToken(token);

        res.locals = { user };
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(401).send(error.message);
        }
        res.sendStatus(500);
    }
}

export { registerUser, validateUserAuthentication };
