console.log("This is a content script running in the page.");
const webhookURL = "https://hook.us1.make.com/fmfxtlim2hud7igx61t0rd5hwdi3maog";

// Function for building chat name, transcript and saving to Notion
const saveToNotion = () => {
  //disable savebtn
  saveBtn.setAttribute("disabled", "disabled");

  let chatName = "New chat";
  let transcript = "";

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
    }),
  })
    .then((response) => response.text())
    .then((text) => {
      console.log("Webhook response:", text);
      //enable savebtn
      saveBtn.removeAttribute("disabled");
    });
};

// Create save button
const saveBtn = document.createElement("div");
saveBtn.appendChild(document.createTextNode("💾"));
saveBtn.setAttribute(
  "class",
  "flex btn relative btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-token-border-medium focus:ring-0"
);  // Copied classes from the share chat button on ChatGPT
saveBtn.setAttribute("style", "cursor: pointer;");
saveBtn.setAttribute("title", "Save to Notion");
saveBtn.onclick = saveToNotion;

// For adding save button to the ChatGPT interface
setTimeout(() => {
  const chatHeader = document.querySelectorAll("div.sticky")[0];
  if (chatHeader) {
    for (const child of chatHeader.children) {
      if (child.innerText.toLowerCase().includes("chatgpt")) {
        child.appendChild(saveBtn);
      }
    }
  } else {
    console.error("Could not find chat header");
  }

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


/* TODO
Save button disappears on switching between chats
Figure out if a chat has been previously saved in Notion
Figure out how to append update to a chat / replace the chat with the updated one 
*/