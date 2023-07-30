import { body } from 'express-validator'

export const registerValidation = [
    body('name').isLength({ min: 2 }),
    body('login').isLength({ min: 2 }),
    body('password').isLength({ min: 8 }),
];
