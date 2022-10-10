module.exports = class UserDto{
    id;
    login;

    constructor(model) {
        this.id = model._id;
        this.login = model.login
    }
}