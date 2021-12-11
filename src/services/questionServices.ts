import { Question } from '../protocols/Question';
import { QuestionDB } from '../protocols/QuestionDB';
import TagDB from '../protocols/TagDB';
import * as questionRepository from '../repositories/questionRepository';

async function createQuestion(question: Question): Promise<Object> {
    const newQuestion: QuestionDB = {
        question: question.question.trim(),
        student_name: question.student.trim(),
        student_class: question.class.trim(),
    };

    const insertedQuestion: QuestionDB =
        await questionRepository.insertQuestion(newQuestion);

    if (!insertedQuestion) {
        throw new Error();
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
    const unansweredQuestion = await questionRepository.fetchUnansweredQuestion(
        id
    );

    if (!unansweredQuestion) {
        throw new Error();
    }
    return unansweredQuestion;
}

export { createQuestion, getQuestionById };
