import connection from '../database/connection';
import { QuestionDB } from '../protocols/QuestionDB';
import TagDB from '../protocols/TagDB';

async function insertQuestion(question: QuestionDB): Promise<QuestionDB> {
    const query = `INSERT INTO questions(${Object.keys(question)}) 
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

async function fetchUnansweredQuestion(id: number): Promise<QuestionDB> {
    const result = await connection.query(
        `SELECT * FROM questions WHERE id=$1`,
        [id]
    );

    if (!result) {
        return null;
    }
    return result.rows[0];
}

export {
    insertQuestion,
    insertTags,
    findTags,
    insertQuestionTags,
    fetchUnansweredQuestion,
};
