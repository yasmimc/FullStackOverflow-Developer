import { Router } from 'express';
import * as questionController from '../controllers/questionController';
import authenticate from '../middlewares/auth';

const route = Router();

route.post('/questions', questionController.postQuestion);
route.get('/questions/:id', questionController.getQuestion);
route.post('/questions/:id', authenticate, questionController.postAnswer);
route.get('/questions', questionController.getUnansweredQuestions);

export default route;
