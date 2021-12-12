import AuthError from '../errors/AuthError';
import User from '../protocols/User';
import UserDB from '../protocols/UserDB';
import * as userRepository from '../repositories/userRepository';
import { validate } from 'uuid';

async function createUser(user: User): Promise<UserDB> {
    const newUser = await userRepository.insertUser(user);

    if (!newUser) {
        throw new Error();
    }
    return newUser;
}

async function findUserByToken(token: string): Promise<UserDB> {
    if (!validate(token)) {
        throw new AuthError('Failed to authenticate user');
    }

    const user = await userRepository.fetchUserByToken(token);

    if (!user) {
        throw new AuthError('Failed to authenticate user');
    }
    return user;
}

export { createUser, findUserByToken };
