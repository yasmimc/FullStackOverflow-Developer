import { Router } from 'express';
import * as userController from '../controllers/userController';

const route = Router();

route.post('/users', userController.registerUser);

export default route;
