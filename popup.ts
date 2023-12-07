console.log("This is a popup!");
chrome.action.onClicked.addListener(async (tab) => {
    console.log("Clicked!");
});