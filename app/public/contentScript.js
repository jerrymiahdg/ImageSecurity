document.querySelectorAll('input[type="file"]').forEach((input) => {
  input.addEventListener("change", (event) => {
    // Check event.target.files for image types
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        console.log("Image selected for upload:", file.name);
        alert("Do you want to secure you image with ImageSecure?");
        chrome.runtime.sendMessage({ action: "openPopup" });
        // Further processing or communication with background script
      }
    }
  });
});
