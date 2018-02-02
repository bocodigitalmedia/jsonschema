import * as AJV from 'ajv'
import { Options, Thenable, ErrorObject } from 'ajv'
import { Either, left, right } from 'fp-ts/lib/either'

export type JsonData = null | boolean | number | string | object

export type SimpleType =
    | 'null'
    | 'boolean'
    | 'string'
    | 'number'
    | 'integer'
    | 'array'
    | 'object'

export interface SimpleTypeArray extends Array<SimpleType> {
    0: SimpleType
}

export type Subschema = true | false | Schema

export interface Schema {
    $id?: string
    $schema?: string
    $ref?: string
    $comment?: string
    title?: string
    description?: string
    readOnly?: boolean
    examples?: JsonData[]
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number
    minimum?: number
    exclusiveMinimum?: number
    maxLength?: number
    minLength?: number
    pattern?: string
    additionalItems?: Subschema
    items?: Subschema | SchemaArray
    maxItems?: number
    minItems?: number
    uniqueItems?: boolean
    contains?: Subschema
    maxProperties?: number
    minProperties?: number
    required?: string[]
    additionalProperties?: Subschema
    definitions?: {
        [key: string]: Subschema
    }
    properties?: {
        [key: string]: Subschema
    }
    patternProperties?: {
        [key: string]: Subschema
    }
    dependencies?: {
        [key: string]: Subschema | SchemaArray
    }
    propertyNames?: Subschema
    const?: JsonData
    enum?: JsonData[]
    type?: SimpleType | SimpleTypeArray
    format?: string
    contentMediaType?: string
    contentEncoding?: string
    if?: Subschema
    then?: Subschema
    else?: Subschema
    allOf?: SchemaArray
    anyOf?: SchemaArray
    oneOf?: SchemaArray
    not?: Subschema
}

export interface SchemaArray extends Array<Schema> {
    0: Schema
}

export class ValidationFailed extends Error {
    public data: {
        schema: Schema
        value: any
        errors?: ErrorObject[]
    }

    constructor(schema: Schema, value: any, errors?: ErrorObject[]) {
        super('Validation failed.')
        this.data = { schema, value, errors }
    }
}

export type SyncValidateFn = <T>(a: T) => Either<ValidationFailed, T>
export type AsyncValidateFn = <T>(a: T) => Promise<T>

export function validate(
    schema: Schema & { $async?: never },
    options?: Options
): SyncValidateFn
export function validate(
    schema: Schema & { $async: true },
    options?: Options
): AsyncValidateFn
export function validate(
    schema: Schema & { $async?: never } | Schema & { $async: true },
    options?: Options
): SyncValidateFn | AsyncValidateFn {
    return schema.$async === true
        ? validateAsync(schema, options)
        : validateSync(schema, options)
}

function validateSync(schema: Schema, options?: Options): SyncValidateFn {
    const vf = new AJV(options).compile(schema)

    return <T>(value: T): Either<ValidationFailed, T> =>
        vf(value)
            ? right(value)
            : left(
                  new ValidationFailed(
                      schema,
                      value,
                      vf.errors !== null ? vf.errors : undefined
                  )
              )
}

function validateAsync(
    schema: Schema & { $async: true },
    options?: Options
): AsyncValidateFn {
    const vf = new AJV(options).compile(schema)

    return <T>(value: T): Promise<T> =>
        new Promise((resolve, reject) =>
            (vf(value) as Thenable<T>).then(resolve, error =>
                reject(
                    error.errors
                        ? new ValidationFailed(schema, value, error.errors)
                        : error
                )
            )
        )
}
