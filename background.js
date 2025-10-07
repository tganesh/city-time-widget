async function updateTime() {
  const data = await chrome.storage.local.get(["city", "timezone", "base64Flag"]);
  if (!data.city || !data.timezone) return;

  // Get city time
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    timeZone: data.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  // Set badge text + color
  await chrome.action.setBadgeText({ text: time });
  await chrome.action.setBadgeBackgroundColor({ color: "#2E86DE" });

  // Use the saved flag image (base64)
  if (data.base64Flag) {
    const image = await createImageBitmap(await (await fetch(data.base64Flag)).blob());
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    await chrome.action.setIcon({ imageData });
  }
}

// Update every minute
chrome.alarms.create("updateTime", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(updateTime);

// Run on install/startup
chrome.runtime.onStartup.addListener(updateTime);
chrome.runtime.onInstalled.addListener(updateTime);

// Refresh when popup sends message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg === "refreshTime") updateTime();
});
