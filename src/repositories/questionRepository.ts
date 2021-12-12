import connection from '../database/connection';
import AnswerDB from '../protocols/AnswerDB';
import Question from '../protocols/Question';
import QuestionDB from '../protocols/QuestionDB';
import TagDB from '../protocols/TagDB';

async function insertQuestion(question: Question): Promise<QuestionDB> {
    delete question.tags;
    const query = `INSERT INTO questions(question, student_name, student_class) 
        VALUES ($1, $2, $3) RETURNING *`;

    const values = Object.values(question);

    const result = await connection.query(query, values);
    if (!result) {
        return null;
    }
    return result.rows[0];
}

async function insertTags(tags: string[]): Promise<number[]> {
    let query = `INSERT INTO tags(text) VALUES`;

    const valuesArray: string[] = [];

    for (let i = 0; i < tags.length; i++) {
        valuesArray.push(`('${tags[i]}')`);
    }

    query += String(valuesArray).split(',').join(', ');

    const result = await connection.query(`${query} RETURNING id;`);
    if (!result) {
        return null;
    }

    const tagsIds = result.rows.map((row) => row.id);
    return tagsIds;
}

async function findTags(tags: string[]): Promise<TagDB[]> {
    const preparedTags = String(tags).split(';')[0];
    const preparedQuery = preparedTags.split(',').map((tag) => `'${tag}'`);

    const result = await connection.query(
        `SELECT * FROM tags WHERE text IN (${preparedQuery}); `
    );
    if (!result) {
        return null;
    }
    return result.rows;
}

async function insertQuestionTags(
    questionId: number,
    tagsIds: number[]
): Promise<any> {
    const baseQuery = `INSERT INTO questions_tags(question_id, tag_id) VALUES`;

    const preparedQuery: string[] = [];

    tagsIds.forEach((tag, index) => {
        preparedQuery.push(`(${questionId}, $${index + 1})`);
    });

    const query = baseQuery + String(preparedQuery) + ';';

    const result = await connection.query(query, tagsIds);
    if (!result) {
        return null;
    }
    return result;
}

async function fetchQuestion(id: number): Promise<QuestionDB> {
    const result = await connection.query(
        `SELECT * FROM questions WHERE id=$1`,
        [id]
    );

    if (!result) {
        return null;
    }
    return result.rows[0];
}

async function insertAnswer(
    questionId: number,
    answeredBy: number,
    answer: string
): Promise<AnswerDB> {
    const result = await connection.query(
        `INSERT INTO answers (question_id, answered_by, answer) VALUES($1, $2, $3) RETURNING *`,
        [questionId, answeredBy, answer]
    );

    if (!result) {
        return null;
    }

    return result.rows[0];
}

async function updateQuestionAsAnswered(
    questionId: number
): Promise<QuestionDB> {
    const result = await connection.query(
        `UPDATE questions SET answered = true WHERE id=$1 RETURNING *;`,
        [questionId]
    );

    if (!result) {
        return null;
    }
    return result.rows[0];
}

async function fetchQuestionAnswer(questionId: number): Promise<AnswerDB> {
    const result = await connection.query(
        `SELECT * FROM answers WHERE question_id=$1`,
        [questionId]
    );

    if (!result) {
        return null;
    }
    return result.rows[0];
}

async function fetchUnansweredQuestions(): Promise<QuestionDB[]> {
    const result = await connection.query(
        `SELECT * FROM questions WHERE  answered = false`,
        []
    );

    if (!result) {
        return null;
    }
    return result.rows;
}

export {
    insertQuestion,
    insertTags,
    findTags,
    insertQuestionTags,
    fetchQuestion,
    insertAnswer,
    updateQuestionAsAnswered,
    fetchQuestionAnswer,
    fetchUnansweredQuestions,
};
