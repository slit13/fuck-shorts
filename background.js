function onBeforeRequest(details) {
	const url = details.url.replace(/shorts\//, "watch?v=")
	return { redirectUrl: url };
}

browser.webRequest.onBeforeRequest.addListener(
	onBeforeRequest,
	{ urls: ["https://www.youtube.com/shorts/*"], types: ["main_frame"] },
	["blocking"]
);

browser.webNavigation.onHistoryStateUpdated.addListener(
    (details) => {
        browser.tabs.executeScript(details.tabId, {
            code: `
                if (window.location.href.includes("youtube.com/shorts/")) {
                    console.log("calculating new URL");
                    const regularUrl = window.location.href.replace(/shorts\\//, "watch?v=");
                    console.log("Redirecting from Shorts URL to regular URL: " + regularUrl);
                    window.location.href = regularUrl;
                }
            `
        });
    },
    { url: [{ hostEquals: "www.youtube.com" }] }
);
