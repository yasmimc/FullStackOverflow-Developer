import User from '../protocols/User';
import UserDB from '../protocols/UserDB';
import * as userRepository from '../repositories/userRepository';

async function createUser(user: User): Promise<UserDB> {
    const newUser = await userRepository.insertUser(user);

    if (!newUser) {
        throw new Error();
    }
    return newUser;
}

export { createUser };
