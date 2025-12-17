// ==UserScript==
// @name         Close Operating Hours Prompt
// @namespace    http://tampermonkey.net/
// @version      1.0.1a
// @description  Automatically closes the "Operating hours" prompt whenever the page loads and you are offline
// @author       2600Pz
// @match        https://*.zendesk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let attempts = 0;
    const maxAttempts = 20;

    const checkAndClick = setInterval(() => {
        const button = document.querySelector(`[data-test-id='notification-close-btn']`);
        attempts++;

    if (button) {
        button.click();
        console.log("Close button has been clicked!");
        clearInterval(checkAndClick);
    } else if (attempts >= maxAttempts) {
        console.log("Button not found. Stopping script");
        clearInterval(checkAndClick);
    }
    }, 500);

 })();