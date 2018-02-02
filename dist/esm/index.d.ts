import { Options } from 'ajv';
import { Either } from 'fp-ts/lib/either';
export declare type JsonData = null | boolean | number | string | object;
export declare type SimpleType = 'null' | 'boolean' | 'string' | 'number' | 'integer' | 'array' | 'object';
export interface SimpleTypeArray extends Array<SimpleType> {
    0: SimpleType;
}
export interface Schema {
    $id?: string;
    $schema?: string;
    $ref?: string;
    $comment?: string;
    title?: string;
    description?: string;
    readOnly?: boolean;
    examples?: JsonData[];
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalItems?: Schema;
    items?: Schema | SchemaArray;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    contains?: Schema;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: Schema;
    definitions?: {
        [key: string]: Schema;
    };
    properties?: {
        [key: string]: Schema;
    };
    patternProperties?: {
        [key: string]: Schema;
    };
    dependencies?: {
        [key: string]: Schema | SchemaArray;
    };
    propertyNames?: Schema;
    const?: JsonData;
    enum?: JsonData[];
    type?: SimpleType | SimpleTypeArray;
    format?: string;
    contentMediaType?: string;
    contentEncoding?: string;
    if?: Schema;
    then?: Schema;
    else?: Schema;
    allOf?: SchemaArray;
    anyOf?: SchemaArray;
    oneOf?: SchemaArray;
    not?: Schema;
}
export interface SchemaArray extends Array<Schema> {
    0: Schema;
}
export declare class ValidationFailed extends Error {
    schema: Schema;
    value: any;
    errors: any;
    constructor(schema: Schema, value: any, errors: any);
}
export declare type SyncValidateFn = <T>(a: T) => Either<ValidationFailed, T>;
export declare type AsyncValidateFn = <T>(a: T) => Promise<T>;
export declare function validate(schema: Schema & {
    $async?: never;
}, options?: Options): SyncValidateFn;
export declare function validate(schema: Schema & {
    $async: true;
}, options?: Options): AsyncValidateFn;
export declare function validateSync(schema: Schema, options?: Options): SyncValidateFn;
export declare function validateAsync(schema: Schema & {
    $async: true;
}, options?: Options): AsyncValidateFn;
