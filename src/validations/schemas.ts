import joi from 'joi';

const questionsSchema: joi.ObjectSchema = joi.object({
    question: joi.string().required(),
    student: joi.string().required(),
    class: joi.string().max(3).required(),
    tags: joi.string(),
});

export { questionsSchema };
