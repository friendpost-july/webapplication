"use strict";

import ApiClient from "./apiClient.js";

function populateProfile(user) {
    document.getElementById('profileName').innerText = user.fullName;
    document.getElementById('profileEmail').innerText = user.email;
    document.getElementById('profileCurrentCity').value = user.currentCity;
    document.getElementById('profileHomeTown').value = user.homeTown;
}

async function saveProfile() {
    const currentCity = document.getElementById('profileCurrentCity').value;
    const homeTown = document.getElementById('profileHomeTown').value;
    if (currentCity || homeTown) {
        const client = new ApiClient();
        try {
            const result = await client.modifyProfile(window.profileid, currentCity, homeTown);
            window.alert("Saved.")
        } catch (error) {
            window.alert(`Could not modify profile: ${error}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', async (e) => {
    const id = window.profileid;
    if(!id) {
        window.alert("Profile not available.");
        return;
    }

    const client = new ApiClient();
    try {
        const result = await client.getProfile(id);
        
        populateProfile(result[0]);
        document.getElementById('profileSave')?.addEventListener('click', (e) => {
            saveProfile();
        })
    } catch (error) {
        window.alert("Profile not available.");
    }
});