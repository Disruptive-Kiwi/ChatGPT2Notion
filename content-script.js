console.log("This is a content script running in the page.");

// Function for building chat name, transcript and saving to Notion
(() => {
  const webhookURL = "YOUR_WEBHOOK_URL_HERE";
  // STARTERCONF: REPLACE ☝🏼 THIS WITH YOUR OWN WEBHOOK URL

  let chatName = "New chat";
  let transcript = "";
  const currentUrl = window.location.href;
  console.log(`currentUrl: ${currentUrl}`);
 
  document.querySelectorAll("li[data-projection-id]").forEach((node) => {
    if (node.querySelector("button")) {
      // console.log('Looks like chat name is', node.querySelector('a').innerText)
      chatName = node.querySelector("a").innerText;
    }
  });

  const listOfMessages = document.querySelectorAll(
    "[data-message-author-role]"
  );
  // console.log('list', listOfMessages)
  listOfMessages.forEach((message) => {
    const role = message.getAttribute("data-message-author-role");
    transcript += `${role.toUpperCase()}:\n${message.innerText}\n\n---\n\n`;
  });

  console.log("Sending chat transcript...");
  fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: chatName,
      transcript,
      currentUrl,
    }),
  })
    .then((response) => response.text())
    .then((text) => {
      console.log("Webhook response:", text);
      chrome.runtime.sendMessage({
        type: "set_badge",
        options: {
          response: text.toLowerCase(),
          chatName,
        },
      });
      console.log("Message sent to service worker");
    });
})();

/* // Create save button
const saveBtn = document.createElement("div");
saveBtn.appendChild(document.createTextNode("💾"));
saveBtn.setAttribute(
  "class",
  "flex btn relative btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-token-border-medium focus:ring-0"
);  // Copied classes from the share chat button on ChatGPT
saveBtn.setAttribute("style", "cursor: pointer;");
saveBtn.setAttribute("title", "Save to Notion");
saveBtn.onclick = saveToNotion;
 */

/* // For adding save button to the ChatGPT interface
setTimeout(() => {
  const chatHeader = Array.from(document.querySelectorAll("div.sticky")).reverse()[0];

  if (chatHeader) {
    for (const child of chatHeader.children) {
      if (child.innerText.toLowerCase().includes("chatgpt")) {
        child.appendChild(saveBtn);
      }
    }
  } else {
    console.error("Could not find chat header");
  }

  window.addEventListener('popstate', function (event) {
    console.log('location changed!, event');
  });

  // Work on visibility change as expected
  document.onvisibilitychange = function () {
    console.log("Visibility changed to", document.visibilityState, Date.now());
    // TODO
  };
  // Works but only on url change
  // window.addEventListener("beforeunload", function (e) {
  //   e.preventDefault();
  //   e.returnValue = "";
  //   console.log("Logged this as the user moved away from the page.");
  // });
}, 5000);
 */

/* TODO
DONE - Initiate save to Notion by clicking extension button
DONE - Add a way of showing that chat has been successfuly saved to Notion - through a badge
Figure out if a chat has been previously saved in Notion - might need to connect to Notion for this
Figure out how to append update to a chat / replace the chat with the updated one 
Tables don't make it across very nicely - need to figure out how to format them
Add shortcut to save to Notion - not being able to see any response from shortcuts
Save button disappears when a new chat kicks off - additional messages to that chat don't have this problem
Save button disappears on switching between chats
*/
