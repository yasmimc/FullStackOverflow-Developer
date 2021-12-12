class InsertAnswerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InsertAnswerError';

        Object.setPrototypeOf(this, InsertAnswerError.prototype);
    }
}

export default InsertAnswerError;
