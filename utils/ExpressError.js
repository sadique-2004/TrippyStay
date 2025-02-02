class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // Call the parent class (Error) constructor
        this.statusCode = statusCode; // Assign the passed statusCode to this.statusCode
        this.message = message; // Assign the passed message to this.message
    }
}

module.exports = ExpressError;
