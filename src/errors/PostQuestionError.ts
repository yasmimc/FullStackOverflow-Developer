class PostQuestionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PostQuestionError';

        Object.setPrototypeOf(this, PostQuestionError.prototype);
    }
}

export default PostQuestionError;
