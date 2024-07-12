"use strict";

const ApiClientBase = require('./apiClientBase.js');

class TimelineApiClient extends ApiClientBase {
    constructor(baseUrl) {
        super(baseUrl);
    }

    async getTimeline(userId) {
        return this.get(`/timeline/${userId}`);
    }
}

module.exports = TimelineApiClient;