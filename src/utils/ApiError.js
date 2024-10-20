class APIErros extends Error {
    constructor(
        statusCode,
        message = 'something went wronge',
        errors =[],
        stack = ""
    ){
        super(message),
        this.statusCode = statusCode;
        this.errors = errors;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {APIErros}