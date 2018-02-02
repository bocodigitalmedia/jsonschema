import { Schema, validate } from '..'

const schema: Schema = {
    $id: 'https://example.com/schemas#user',
    title: 'User',
    description: 'A user object',
    type: 'object',
    required: ['name', 'email'],
    additionalProperties: false,
    properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
    }
}

const validateUser = validate(schema)

validateUser({ name: 'John Doe', email: 'john.doe@example.com' }).fold(
    ({ data }) => console.log('KO', data),
    user => console.log('OK', user)
)
