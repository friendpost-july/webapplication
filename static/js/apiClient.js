"use strict";

class ApiClientBase {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, method = 'GET', body = null, headers = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} : ${response.statusText} - ${JSON.stringify(response.headers)}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    }

    get(endpoint, headers = {}) {
        return this.request(endpoint, 'GET', null, headers);
    }

    post(endpoint, body, headers = {}) {
        return this.request(endpoint, 'POST', body, headers);
    }

    put(endpoint, body, headers = {}) {
        return this.request(endpoint, 'PUT', body, headers);
    }

    delete(endpoint, headers = {}) {
        return this.request(endpoint, 'DELETE', null, headers);
    }
}

export default class ApiClient extends ApiClientBase {
    constructor() {
        super('');
    }

    async getTimeline(userId) {
        return this.get('/api/timeline');
    }

    async createPost(text) {
        return this.post('/api/posts', { posttext: text });
    }

    async getProfile(userId) {
        return this.get(`/api/users?ids=${userId ?? ''}`)
    }

    async modifyProfile(userId, currentCity, homeTown) {
        return this.put(`/api/users/${userId}`, { currentCity: currentCity, homeTown: homeTown});
    }
}
