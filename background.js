const sendToOpenOversight = (id, imageUrl) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    chrome.tabs.sendMessage(tabs[0].id, {
      openOversightPlugin: { event: "sending" },
    });

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("file", blob, "upload.png");
        const url = `https://openoversight.lucyparsonslabs.com/upload/department/${id}`;
        fetch(url, {
          method: "POST",
          body: formData,
        })
          .then(() => {
            chrome.tabs.sendMessage(tabs[0].id, {
              openOversightPlugin: { event: "success" },
            });
          })
          .catch(() => {
            chrome.tabs.sendMessage(tabs[0].id, {
              openOversightPlugin: { event: "error" },
            });
          });
      }, "image/png");
    };
  });
};

const parentMenu = chrome.contextMenus.create({
  title: "Send to Open Oversight",
  contexts: ["image"],
});

const departments = [
  [1, "Chicago Police Department"],
  [2, "Berkeley Police Department"],
  [3, "Oakland Police Department"],
  [4, "University of California Police Department"],
  [5, "Immigration and Customs Enforcement"],
  [6, "Customs and Border Protection"],
  [7, "New York City Police Department"],
  [8, "Salt Lake City Police Department"],
  [9, "Buffalo Police Department"],
  [10, "Burlington Police Department"],
  [11, "UVM Police Services"],
  [12, "Chittenden County Sheriff's Office"],
  [13, "Vermont Capitol Police"],
];

for (const [id, name] of departments) {
  chrome.contextMenus.create({
    title: name,
    contexts: ["image"],
    parentId: parentMenu,
    onclick: ({ srcUrl }) => sendToOpenOversight(id, srcUrl),
  });
}
