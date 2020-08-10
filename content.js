const createToast = () => {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = "#4caf50";
  toast.style.color = "#ffffff";
  toast.style.fontWeight = "500";
  toast.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
  toast.style.padding = "6px 16px";
  toast.style.borderRadius = "4px";
  toast.style.boxShadow =
    "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)";
  toast.style.transition = "opacity 0.4s ease-in";
  toast.style.opacity = 0;
  toast.style.zIndex = 10000;
  document.body.appendChild(toast);
  return toast;
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.openOversightPlugin) {
    const toast = createToast();

    switch (request.openOversightPlugin.event) {
      case "sending":
        toast.style.backgroundColor = "#2196f3";
        toast.innerHTML = "Sending image to Open Oversight...";
        break;
      case "success":
        toast.innerHTML = "Image uploaded to Open Oversight successfully.";
        break;
      case "error":
        toast.style.backgroundColor = "#f44336";
        toast.innerHTML =
          "There was an error uploading your file to Open Oversight.";
        break;
      default:
        console.error(
          "Unhandled Open Oversight event",
          request.openOversightPlugin
        );
        return;
    }

    toast.style.opacity = 1;
    window.setTimeout(() => {
      toast.style.opacity = 0;
      window.setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 5000);
  }
});
