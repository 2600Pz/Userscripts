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

    // 1. Team Mappings
    const TEAMS = {
        '1': 'Team 1',
        '2': 'Team 2',
        '3': 'Team 3',
        '4': 'Team 4',
        'e': 'Educational Apps'
    };

    // The main field you click to open the menu
    const dataTestID = "assignee-field-autocomplete-trigger";

    // The dropdown menu container (used for fallback targeting)
    const menuTestID = "assignee-field-dropdown-menu";

    let assignModeActive = false;


    document.addEventListener('keydown', key);
    
    function key(){
            if (key.ctrlKey && key.shiftKey && (key.key === 'a' || key.key === 'A')) {
            key.preventDefault();

            const assignField = document.querySelector(`[data-test-id="${dataTestID}"]`);

            if (assignField) {
                assignField.click();
                assignModeActive = true;
                assignField.style.border = "3px solid red"; // Visual Indicator
                console.log("Assignment Mode: ON");
            }
            return;
        }

        // ACTION: 1-4
        if (assignModeActive && TEAMS[key.key]) {
            key.preventDefault();
            key.stopPropagation();

            performAssignment(TEAMS[key.key]);

            // Reset
            assignModeActive = false;
            if(assignField) assignField.style.border = "";
        }

        // CANCEL: Escape
        if (e.key === "Escape" && assignModeActive) {
            assignModeActive = false;
            console.log("Assignment Mode: OFF");
            if(assignField) assignField.style.border = "";
        }
    };

    function performAssignment(teamName) {
        setTimeout(() => {
            let menuInput = document.activeElement;

            // Fallback: Use the MENU_TEST_ID variable
            if (!menuInput || menuInput.tagName !== 'INPUT') {
                 menuInput = document.querySelector(`[data-test-id="${menuTestID}"] input`);
            }

            if (menuInput) {
                // 1. Type Team Name
                setNativeValue(menuInput, teamName);
                menuInput.dispatchEvent(new Event('input', { bubbles: true }));

                // 2. Wait for Filter, then Double Enter
                setTimeout(() => {
                    const enterEvent = new KeyboardEvent('keydown', {
                        bubbles: true, cancelable: true, keyCode: 13, key: 'Enter'
                    });

                    // First Enter (Select)
                    menuInput.dispatchEvent(enterEvent);

                    // Second Enter (Confirm)
                    setTimeout(() => {
                        // Re-dispatching the same event object can be buggy, safer to recreate
                        const enterEvent2 = new KeyboardEvent('keydown', {
                            bubbles: true, cancelable: true, keyCode: 13, key: 'Enter'
                        });
                        menuInput.dispatchEvent(enterEvent2);
                    }, 150);

                }, 200);
            }
        }, 150);
    }

    // Helper for React Inputs
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

})();