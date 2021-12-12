class AnswerNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AnswerNotFoundError';

        Object.setPrototypeOf(this, AnswerNotFoundError.prototype);
    }
}

export default AnswerNotFoundError;
