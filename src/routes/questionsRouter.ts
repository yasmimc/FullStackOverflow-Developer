import { Router } from 'express';
import * as questionController from '../controllers/questionController';

const route = Router();

route.post('/questions', questionController.postQuestion);
route.get('/questions/:id', questionController.getQuestion);

export default route;
