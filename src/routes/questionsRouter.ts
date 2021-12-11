import { Router } from 'express';
import * as questionController from '../controllers/questionController';

const route = Router();

route.post('/questions', questionController.postQuestion);

export default route;
