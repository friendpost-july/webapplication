"use strict";

import ApiClient from "./apiClient.js";

const getTimelineDiv = () => {
    return document.querySelector('div.postsection.timelinesection > div');
}

const clearTimeline = (message) => {
    const timelinediv = getTimelineDiv();
    const content = message || ""
    timelinediv.innerHTML = content;
}

const addTimelineItem = (item) => {
    const newdiv = document.createElement('div');
    //newdiv.attributes['class'] = "section timelineitem";
    newdiv.setAttribute('class', 'section timelineitem');
    newdiv.innerHTML = `<h3>${item.userName}</h3><p>${item.content}</p>`;

    const timelinediv = getTimelineDiv();
    timelinediv.insertBefore(newdiv, timelinediv.firstChild);
}

document.addEventListener('DOMContentLoaded', async (e) => {
    const tclient = new ApiClient('');
    const timelinediv = document.querySelector('div.postsection.timelinesection');

    try {
        const results = await tclient.getTimeline();
        if (results.length && results.length < 0) {
            clearTimeline('Nothing to see here.');
            return
        }
        clearTimeline();
        for (let i = 0; i < results.length; i++) {
            console.log(results[i]);
            addTimelineItem(results[i]);
        }
    
    } catch {
        clearTimeline('Please try again later. <div><button class="refreshbutton">Refresh</button></div>');
    }

});

document.getElementById('createpostbutton').addEventListener('click', async (e) => {
    const textarea = document.getElementById('newpost');
    const tclient = new ApiClient('');
    try {
        const result = await tclient.createPost(textarea.value);
        if (result.data.postId) {
            addTimelineItem({ userName: 'window.user.userName', content: textarea.value + ` PostId:${result.data.postId}` });
        }
    } catch (error) {
        window.alert("ERROR:" + error);
    }
})

window.addEventListener('click', (e) => {
    if(e.target.matches('.refreshbutton')) {
        window.location.reload();
    }
});