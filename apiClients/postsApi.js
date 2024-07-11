"use strict";

const ApiClientBase = require('./apiClientBase.js');

class PostApiClient extends ApiClientBase {
    constructor(baseUrl) {
        super(baseUrl);
    }

    async createPost(userId, text, visibility) {
        return this.post('/posts', { userId: userId, text: text, visibility: visibility });
    }
}

module.exports = PostApiClient;