const Router = require('express').Router
const UserController = require('../controller/user-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middlewares')
const validator = require('../middlewares/validation-middlewares')

const router = new Router()

router.post('/signup',validator.login(), validator.password(), UserController.signup)
router.post('/signin', validator.login(), validator.password(), UserController.signin)
router.get('/users', authMiddleware, UserController.users)

router.get('/user/:id', UserController.UserID)
router.post('/logout',UserController.logout)
router.get('refresh', UserController.refresh)

//router.get('/me', UserController.me)

module.exports = router