// Convert image URL → base64
async function fetchAsBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

document.getElementById("saveBtn").addEventListener("click", async () => {
  const select = document.getElementById("citySelect");
  const timezone = select.value;
  const flagUrl = select.selectedOptions[0].dataset.flag;
  const city = select.options[select.selectedIndex].text;

  if (!timezone) {
    alert("Please select a city");
    return;
  }

  // fetch flag as base64
  const base64Flag = await fetchAsBase64(flagUrl);

  await chrome.storage.local.set({
    city,
    timezone,
    flagUrl,
    base64Flag
  });

  chrome.runtime.sendMessage("refreshTime");
  window.close();
});
