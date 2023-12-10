const matchUrl = 'https://chat.openai.com/'

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

chrome.action.onClicked.addListener(async (tab) => {
  if(tab.url.startsWith(matchUrl)) {
    console.log('Extension clicked')
    // Execute saveToNotion from content-script.js
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"],
    });
    console.log('Script executed')
  }
});
