import { Request, Response } from 'express';
import { Question } from '../protocols/Question';
import { questionsSchema } from '../validations/schemas';
import * as questionService from '../services/questionServices';
import AnsweredQuestionError from '../errors/AnsweredQuestionError';
import AnswerNotFoundError from '../errors/AnswerNotFoundError';
import UnansweredQuestionsNotFoundError from '../errors/UnansweredQuestionsNotFoundError';

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

        return res.send(insertedQuestionId);
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function getQuestion(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        const question = await questionService.getQuestionById(Number(id));
        return res.send(question);
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function postAnswer(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { user } = res.locals;
        const { answer } = req.body;
        const question = await questionService.postAnswer(
            Number(id),
            user.id,
            answer
        );
        res.send(question);
    } catch (error) {
        if (error instanceof AnsweredQuestionError) {
            return res.status(400).send(error.message);
        }

        if (error instanceof AnswerNotFoundError) {
            return res.status(404).send(error.message);
        }

        res.sendStatus(500);
    }
}

async function getUnansweredQuestions(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const unansweredQuestions =
            await questionService.getUnansweredQuestions();
        return res.send(unansweredQuestions);
    } catch (error) {
        if (error instanceof UnansweredQuestionsNotFoundError) {
            return res.status(404).send(error.message);
        }
        res.sendStatus(500);
    }
}

export { postQuestion, getQuestion, postAnswer, getUnansweredQuestions };
