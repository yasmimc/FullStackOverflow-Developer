import { Request, Response } from 'express';
import { Question } from '../protocols/Question';
import { questionsSchema } from '../validations/schemas';
import * as questionService from '../services/questionServices';

async function postQuestion(req: Request, res: Response): Promise<Response> {
    try {
        const newQuestion: Question = req.body;
        const validation = questionsSchema.validate(newQuestion);
        if (validation.error) {
            return res.sendStatus(400);
        }

        const insertedQuestionId: Object = await questionService.createQuestion(
            newQuestion
        );

        res.send(insertedQuestionId);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function getQuestion(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const question = await questionService.getQuestionById(Number(id));
        res.send(question);
    } catch (error) {
        res.sendStatus(500);
    }
}

export { postQuestion, getQuestion };