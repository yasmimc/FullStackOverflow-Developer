class InsertTagsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InsertTagsError';

        Object.setPrototypeOf(this, InsertTagsError.prototype);
    }
}

export default InsertTagsError;
