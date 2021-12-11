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

export { postQuestion };
