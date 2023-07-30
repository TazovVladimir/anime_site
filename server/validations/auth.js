import { body } from 'express-validator'

export const authValidation = [
    body('login').isLength( { min: 2} ),
    body('password').isLength( { min: 8} ),
];
