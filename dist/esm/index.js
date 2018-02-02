import * as AJV from 'ajv';
import { left, right } from 'fp-ts/lib/either';
export class ValidationFailed extends Error {
    constructor(schema, value, errors) {
        super('Validation failed.');
        this.schema = schema;
        this.value = value;
        this.errors = errors;
    }
}
export function validate(schema, options) {
    return schema.$async === true
        ? validateAsync(schema, options)
        : validateSync(schema, options);
}
export function validateSync(schema, options) {
    const vf = new AJV(options).compile(schema);
    return (value) => vf(value)
        ? right(value)
        : left(new ValidationFailed(schema, value, vf.errors));
}
export function validateAsync(schema, options) {
    const vf = new AJV(options).compile(schema);
    return (value) => new Promise((resolve, reject) => vf(value).then(resolve, error => reject(error.errors
        ? new ValidationFailed(schema, value, error.errors)
        : error)));
}
