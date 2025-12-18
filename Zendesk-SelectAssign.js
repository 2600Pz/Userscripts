// ==UserScript==
// @name         Zendesk Quick Assign
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ctrl+Shift+A to trigger assignment mode
// @match        https://*.zendesk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // The main field you click to open the menu
    const dataTestID = "assignee-field-autocomplete-trigger";

    // The dropdown menu container (used for fallback targeting)
    const menuTestID = "assignee-field-dropdown-menu";


 document.addEventListener('keydown', function(keypress) {
            if (keypress.altKey && keypress.shiftKey && (keypress.key === 'q' || keypress.key === 'Q')) {
            keypress.preventDefault();

            const assignField = document.querySelector(`[data-test-id="${dataTestID}"]`);

            if (assignField) {
                assignField.click();
            }
            return;
        }

    });


})();