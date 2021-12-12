import AnsweredQuestionError from '../errors/AnsweredQuestionError';
import InsertAnswerError from '../errors/InsertAnswerError';
import InsertTagsError from '../errors/InsertTagsError';
import PostQuestionError from '../errors/PostQuestionError';
import QuestionNotFoundError from '../errors/QuestionNotFoundError';
import UnansweredQuestionsNotFoundError from '../errors/UnansweredQuestionsNotFoundError';
import AnswerDB from '../protocols/AnswerDB';
import AnswerResObj from '../protocols/AnswerResObj';
import Question from '../protocols/Question';
import QuestionDB from '../protocols/QuestionDB';
import QuestionResObj from '../protocols/QuestionResObj';
import TagDB from '../protocols/TagDB';
import * as questionRepository from '../repositories/questionRepository';

async function createQuestion(question: Question): Promise<Object> {
    const newQuestion: Question = {
        question: question.question.trim(),
        student: question.student.trim(),
        class: question.class.trim(),
        tags: question.tags,
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
                throw new InsertTagsError('Error saving question tags');
            }

            insertedTags.forEach((tag) => tagsIds.push(tag));
        }

        const insertedQuestionTags =
            await questionRepository.insertQuestionTags(
                insertedQuestion.id,
                tagsIds
            );

        if (!insertedQuestionTags) {
            throw new InsertTagsError('Error saving question tags');
        }
    }

    return { id: insertedQuestion.id };
}

async function getQuestionById(id: number): Promise<QuestionResObj> {
    const question = await questionRepository.fetchQuestion(id);

    if (!question) {
        throw new QuestionNotFoundError('This question was not found');
    }

    if (question.answered) {
        const answer = await questionRepository.fetchQuestionAnswer(
            question.id
        );

        return { ...formatQuestionObj(question), ...formatAnswerObj(answer) };
    }
    return formatQuestionObj(question);
}

async function postAnswer(
    questionId: number,
    answeredBy: number,
    answer: string
): Promise<AnswerResObj> {
    const question = await questionRepository.fetchQuestion(questionId);

    if (!question) {
        throw new QuestionNotFoundError('This question was not found');
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
        throw new InsertAnswerError('Error posting answer');
    }

    const updatedQuestion = await questionRepository.updateQuestionAsAnswered(
        questionId
    );

    if (!updatedQuestion) {
        throw new InsertAnswerError('Error posting answer');
    }

    const formatedQuestionObj = formatAnswerObj(questionAnswer);
    delete formatedQuestionObj.answeredAt;
    delete formatedQuestionObj.answeredBy;
    return formatedQuestionObj;
}

async function getUnansweredQuestions(): Promise<QuestionResObj[]> {
    const result: QuestionDB[] =
        await questionRepository.fetchUnansweredQuestions();
    if (!result) {
        throw new Error();
    }
    if (result.length === 0) {
        throw new UnansweredQuestionsNotFoundError(
            'Unanswered questions were not found'
        );
    }
    return result.map((question) => {
        const result = formatQuestionObj(question);
        delete result.answered;
        return result;
    });
}

function formatQuestionObj(question: QuestionDB): QuestionResObj {
    const formatQuestionObj = {
        id: question.id,
        ...question,
        submitAt: new Date(question.submit_at)
            .toISOString()
            .replace('T', ' ')
            .split('Z')[0],
        student: question.student_name,
        class: question.student_class,
    };

    if (!formatQuestionObj.id) delete formatQuestionObj.id;
    delete formatQuestionObj.submit_at;
    delete formatQuestionObj.student_name;
    delete formatQuestionObj.student_class;
    return formatQuestionObj;
}

function formatAnswerObj(answer: AnswerDB): AnswerResObj {
    const formatQuestionObj = {
        answer: answer.answer,
        answeredAt: new Date(answer.answered_at)
            .toISOString()
            .replace('T', ' ')
            .split('Z')[0],
        answeredBy: answer.answered_by,
    };
    return formatQuestionObj;
}

export { createQuestion, getQuestionById, postAnswer, getUnansweredQuestions };
