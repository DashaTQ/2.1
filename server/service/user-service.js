const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const TokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async signup(login, password){
        //проверяем, есть ли пользователь с таким же ником
        const newUser = await UserModel.findOne({login})

        //Если пользователь есть - выводим ошибку
        if (newUser){
            throw new ApiError.BadRequest('Пользователь с таким ником уже существует')
        }

        //Хэшируем пароль
        const hashPassword = await bcrypt.hash(password, 5)

        //Сохраняем пользователя в базу данных
        const user = await UserModel.create({login, password: hashPassword})

        const userDto = new UserDto(user)
        const tokens = TokenService.generatorToken({...userDto})

        //Генерируем токены
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        //Возвараем информацию о пользователе и токены
        return{
            ...tokens,
            user: userDto
        }
    }

    async signin(login, password){
        const user = await UserModel.findOne({login})
        if(!user){
            throw ApiError.BadRequest('Некорректный логин или пароль (По секрету, пользователь не существует)')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw ApiError.BadRequest('Некорректный логин или пароль (По секрету, пароль неправильный)')
        }

        const userDto = new UserDto(user)
        const tokens = TokenService.generatorToken({...userDto})

        //Генерируем токены
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        //Возвараем информацию о пользователе и токены
        return{
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken){
        const token = await TokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generatorToken({...userDto})

        //Генерируем токены
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        //Возвараем информацию о пользователе и токены
        return{
            ...tokens,
            user: userDto
        }
    }

    async users(){
        const users = await UserModel.find()
        return users;
    }
}

module.exports = new UserService()