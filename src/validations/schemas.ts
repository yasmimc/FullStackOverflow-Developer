import joi from 'joi';

const questionsSchema: joi.ObjectSchema = joi.object({
    question: joi.string().required(),
    student: joi.string().required(),
    class: joi.string().max(3).required(),
    tags: joi.string(),
});

const usersSchema: joi.ObjectSchema = joi.object({
    name: joi.string().min(3).required(),
    class: joi.string().max(3).required(),
});

export { questionsSchema, usersSchema };
