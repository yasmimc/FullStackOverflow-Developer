class QuestionNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QuestionNotFoundError';

        Object.setPrototypeOf(this, QuestionNotFoundError.prototype);
    }
}

export default QuestionNotFoundError;
