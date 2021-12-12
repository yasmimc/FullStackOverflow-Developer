class UnansweredQuestionsNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnansweredQuestionsNotFoundError';

        Object.setPrototypeOf(this, UnansweredQuestionsNotFoundError.prototype);
    }
}

export default UnansweredQuestionsNotFoundError;
