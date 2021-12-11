import { Request, Response } from 'express';
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

export { registerUser };
