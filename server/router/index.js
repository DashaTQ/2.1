const Router = require('express').Router
const UserController = require('../controller/user-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middlewares')
const validator = require('../middlewares/validation-middlewares')

const router = new Router()

router.post('/signup',validator.login(),

    body('password')
        .exists()
        .withMessage('Пароль должен существовать')

        .isString()
        .withMessage('Пароль должен быть строковым значениям')

        .isLength({ min: 6, max: 12 })
        .withMessage('Логин должен быть от 2 до 180 символов'),
    UserController.signup
)

router.post('/signin',
    body ('login')
        .exists()
        .withMessage('Логин должен существовать')

        .isString()
        .withMessage('Логин должен быть строковым значениям')

        .isLength({ min: 2, max: 180 })
        .withMessage('Логин должен быть от 2 до 180 символов')

        .custom(login => !/\s/.test(login))
        .withMessage('Логин должен быть от 2 до 180 символов'),

    body('password')
        .exists()
        .withMessage('Пароль должен существовать')

        .isString()
        .withMessage('Пароль должен быть строковым значениям')

        .isLength({ min: 6, max: 12 })
        .withMessage('Логин должен быть от 2 до 180 символов'),
    UserController.signin
)

router.get('/me', UserController.me)
router.get('/users', authMiddleware, UserController.users)
router.get('/user/:id', UserController.UserID)

router.post('/logout',UserController.logout)


router.get('refresh', UserController.refresh)

module.exports = router