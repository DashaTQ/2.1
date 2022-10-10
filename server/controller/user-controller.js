const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController{
    async signup(req, res, next){
        try {
            //Проверка на валидации
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const {login, password} = req.body
            const userData = await userService.signup(login, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        }catch (e){
            next(e)
        }
    }

    async signin(req, res, next){
        try {
            //Проверка на валидации
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }

            const {login, password} = req.body;
            const userData = await userService.signin(login, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)


        }catch (e){
            next(e)
        }
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        }catch (e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies

            const userData = await userService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)


        }catch (e){
            next(e)
        }
    }

    async UserID(req, res, next){
        try {

        }catch (e){
            next(e)
        }
    }

    async users(req, res, next){
        try {
            const users = await userService.users()
            return res.json(users)
        }catch (e){
            next(e)
        }
    }

    async me(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()