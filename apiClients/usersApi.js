"use strict";

const ApiClientBase = require('./apiClientBase.js');

class UsersApiClient extends ApiClientBase {
    constructor(baseUrl) {
        super(baseUrl);
    }

    async getUser(userId) { 
        const ids = Array.isArray(userId) ? userId.join(',') : userId
        return this.get(`/users?ids=${ids}`);
    }

    async createUser(email, name) {
        const newUser = {
            email: email,
            fullName: name,
            currentCity: '',
            homeTown: ''
        };
        return this.post('/users', newUser);
    }

    async modifyUser(userId, currentCity, homeTown) {
        const modifiedRecord = {
            currentCity: currentCity,
            homeTown: homeTown
        }
        return this.put(`/users/${userId}`, modifiedRecord);
    }
}

module.exports = UsersApiClient;
