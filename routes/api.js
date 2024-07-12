"use strict";

const express = require('express');
const router = express.Router();
const TimelineApiClient = require('../apiClients/timelineApi.js');
const PostApiClient = require('../apiClients/postsApi.js');
const UsersApiClient = require('../apiClients/usersApi.js');

/** @type {import("express").RequestHandler} */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send('forbidden');
}

const API_TIMELINE_URL = process.env.API_TIMELINE_URL || "http://localhost:15056";
const API_POSTS_URL = process.env.API_POSTS_URL || 'http://localhost:15001/v1';
const API_USERS_URL = process.env.API_USERS_URL || 'http://localhost:15002/v1';

router.use(express.json());

router.get('/timeline', ensureAuthenticated, async (req, res) => {
    const client = new TimelineApiClient(API_TIMELINE_URL);
    try {
        const result = await client.getTimeline(req.user.id);
        res.json(result);
    } catch (error) {
        console.log('Error while getting timeline:', error);
        res.status(500).json({ message: error });
    }
});

router.post('/posts', ensureAuthenticated, async (req, res) => {
    const client = new PostApiClient(API_POSTS_URL);
    try {
        const result = await client.createPost(req.user.id, req.body.posttext, 'public');
        res.json(result);
    } catch (error) {
        console.log('Error while creating post:', error);   
        res.status(500).json({ message: error });
    }
});

router.get('/users', ensureAuthenticated, async (req, res) => {
    const client = new UsersApiClient(API_USERS_URL);
    const ids = req.query.ids ?? req.user.id
    try {
        const result = await client.getUser(ids);
        res.json(result);
    } catch (error) {
        console.log('Error while getting user:', error);
        res.json({ error: error });
    }
});

router.put('/users/:id', ensureAuthenticated, async (req, res) => {
    const client = new UsersApiClient(API_USERS_URL);
    const id = req.params["id"];
    try {
        const result = await client.modifyUser(id, req.body.currentCity, req.body.homeTown);
        res.json(result);
    } catch (error) {
        console.log('Error while modifying user:', error);
        res.json({ error: error });
    }
});

module.exports = router;