"use strict";

const ApiClientBase = require('./apiClientBase.js');

class UsersApiClient extends ApiClientBase {
    constructor(baseUrl) {
        super(baseUrl);
    }

    async getUser(userId) {
        return this.get(`/users/${userId}`);
    }

    async createUser(email, name) {
        const newUser = {
            id: "unknown",
            email: email,
            firstName: name
        };
        return this.post('/users', newUser);
    }
}

module.exports = UsersApiClient;
