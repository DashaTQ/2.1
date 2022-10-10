const {body} = require("express-validator");

class Validator {
    login() {
        return body('login')
            .exists()
            .withMessage('Логин должен существовать')

            .isString()
            .withMessage('Логин должен быть строковым значениям')

            .isLength({ min: 2, max: 180 })
            .withMessage('Логин должен быть от 2 до 180 символов')

            .custom(login => !/\s/.test(login))
            .withMessage('Логин должен быть от 2 до 180 символов')
    }
}

module.exports = new Validator()