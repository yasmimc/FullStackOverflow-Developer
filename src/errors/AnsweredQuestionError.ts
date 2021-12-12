class AnsweredQuestionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AnsweredQuestionError';

        Object.setPrototypeOf(this, AnsweredQuestionError.prototype);
    }
}

export default AnsweredQuestionError;
