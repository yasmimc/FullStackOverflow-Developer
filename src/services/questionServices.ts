import AnsweredQuestionError from '../errors/AnsweredQuestionError';
import AnswerNotFoundError from '../errors/AnswerNotFoundError';
import PostQuestionError from '../errors/PostQuestionError';
import UnansweredQuestionsNotFoundError from '../errors/UnansweredQuestionsNotFoundError';
import AnswerDB from '../protocols/AnswerDB';
import { Question } from '../protocols/Question';
import { QuestionDB } from '../protocols/QuestionDB';
import TagDB from '../protocols/TagDB';
import * as questionRepository from '../repositories/questionRepository';

async function createQuestion(question: Question): Promise<Object> {
    const newQuestion: Question = {
        question: question.question.trim(),
        student: question.student.trim(),
        class: question.class.trim(),
    };

    const insertedQuestion: QuestionDB =
        await questionRepository.insertQuestion(newQuestion);

    if (!insertedQuestion) {
        throw new PostQuestionError('Error posting question');
    }

    if (question.tags) {
        const tagsArray: string[] = question.tags
            .split(',')
            .map((word) => word.trim());
        const existentTags: TagDB[] = await questionRepository.findTags(
            tagsArray
        );

        if (!existentTags) {
            throw new Error();
        }

        const toAddTags: string[] = tagsArray.filter(
            (tag) => !existentTags.map((tag) => tag.text).includes(tag)
        );

        const tagsIds: number[] = existentTags.map((tag) => tag.id);

        if (toAddTags.length > 0) {
            const insertedTags: number[] = await questionRepository.insertTags(
                toAddTags
            );

            if (!insertedTags) {
                throw new Error();
            }

            insertedTags.forEach((tag) => tagsIds.push(tag));
        }

        const insertedQuestionTags =
            await questionRepository.insertQuestionTags(
                insertedQuestion.id,
                tagsIds
            );

        if (!insertedQuestionTags) {
            throw new Error();
        }
    }

    return { id: insertedQuestion.id };
}

async function getQuestionById(id: number): Promise<QuestionDB> {
    const question = await questionRepository.fetchQuestion(id);

    if (!question) {
        throw new Error();
    }

    if (question.answered) {
        const answer = await questionRepository.fetchQuestionAnswer(
            question.id
        );

        return { ...question, ...answer };
    }
    return question;
}

async function postAnswer(
    questionId: number,
    answeredBy: number,
    answer: string
): Promise<AnswerDB> {
    const question = await questionRepository.fetchQuestion(questionId);

    if (!question) {
        throw new AnswerNotFoundError('This question was not found');
    }

    if (question.answered) {
        throw new AnsweredQuestionError(
            'This question has been alredy answered'
        );
    }

    const questionAnswer = await questionRepository.insertAnswer(
        questionId,
        answeredBy,
        answer
    );

    if (!questionAnswer) {
        throw new Error();
    }

    const updatedQuestion = await questionRepository.updateQuestionAsAnswered(
        questionId
    );

    if (!updatedQuestion) {
        throw new Error();
    }
    return questionAnswer;
}

async function getUnansweredQuestions(): Promise<QuestionDB[]> {
    const result = await questionRepository.fetchUnansweredQuestions();
    if (!result) {
        throw new Error();
    }
    if (result.length === 0) {
        throw new UnansweredQuestionsNotFoundError(
            'Unanswered questions were not found'
        );
    }
    return result;
}

export { createQuestion, getQuestionById, postAnswer, getUnansweredQuestions };
