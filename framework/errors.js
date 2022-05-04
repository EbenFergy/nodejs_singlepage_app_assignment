class ValidationError extends Error {
    constructor(messages) {
        super(messages.join(', '))
        this.validations = messages;
        this.name = 'ValidationError';
    }
}


module.exports.ValidationError = ValidationError;



