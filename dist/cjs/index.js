"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AJV = require("ajv");
const either_1 = require("fp-ts/lib/either");
class ValidationFailed extends Error {
    constructor(schema, value, errors) {
        super('Validation failed.');
        this.schema = schema;
        this.value = value;
        this.errors = errors;
    }
}
exports.ValidationFailed = ValidationFailed;
function validate(schema, options) {
    return schema.$async === true
        ? validateAsync(schema, options)
        : validateSync(schema, options);
}
exports.validate = validate;
function validateSync(schema, options) {
    const vf = new AJV(options).compile(schema);
    return (value) => vf(value)
        ? either_1.right(value)
        : either_1.left(new ValidationFailed(schema, value, vf.errors));
}
exports.validateSync = validateSync;
function validateAsync(schema, options) {
    const vf = new AJV(options).compile(schema);
    return (value) => new Promise((resolve, reject) => vf(value).then(resolve, error => reject(error.errors
        ? new ValidationFailed(schema, value, error.errors)
        : error)));
}
exports.validateAsync = validateAsync;
