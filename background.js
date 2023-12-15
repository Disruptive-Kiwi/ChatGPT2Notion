const matchUrl = 'https://chat.openai.com/'

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

chrome.runtime.onMessage.addListener(data => {
  console.log('Received message in service worked', data);
  if(data.type === 'set_badge') {
    const color = data.options.response === 'accepted' ? 'green' : 'black'
    const text = data.options.response === 'accepted' ? '🤙🏼' : '❌'
    
    chrome.action.setBadgeBackgroundColor({color});
    chrome.action.setBadgeText({text},
      () => { 
        console.log('Badge set')
        setTimeout(() => {
          chrome.action.setBadgeText(
            {
              text: "",
            },
            () => { console.log('Badge cleared') },
          );
        }, 5000);
      }
    );
  }
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
