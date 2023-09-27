// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// function addColorFilter() {
//   const now = new Date();
//   const currentHour = now.getHours(); // gets the current hour in 24-hour format
//   const makeDarkMode = () => {
//     document.body.style.filter = "invert(0.9)";
//   };

//   if (currentHour >= 17) {
//     // since 5pm is 17 in 24-hour format
//     makeDarkMode();
//     window.onload = function () {
//       makeDarkMode();
//     };
//   }
// }

function addColorFilterForDarkMode() {
  document.body.style.filter = "invert(0.9)";
}

function removeColorFilterForDarkMode() {
  document.body.style.filter = "none";
}

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

  // Next state will always be the opposite
  const nextState = prevState === "ON" ? "OFF" : "ON";

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function:
        nextState === "ON"
          ? addColorFilterForDarkMode
          : removeColorFilterForDarkMode,
    });
  });
});
