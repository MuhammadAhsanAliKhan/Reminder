browser.runtime.onMessage.addListener((message) => {
  if (message.action === "showReminder") {
    // Prevent duplicate overlays
    if (document.getElementById("reminder-overlay")) return;
    
    // Create overlay 
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";

    // Create popup box
    const popup = document.createElement("div");
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    popup.style.maxWidth = "300px";
    popup.style.width = "80%";
    popup.style.textAlign = "center";
    popup.style.position = "relative";

    // Close button
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;"; // × symbol
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "15px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.fontWeight = "bold";
    closeBtn.onclick = () => overlay.remove();

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Reminder";
    deleteBtn.style.marginTop = "10px";
    deleteBtn.onclick = () => {
      browser.runtime.sendMessage({
        action: "removeTask",
        name: message.name
      });
      overlay.remove();
    };

    // Reminder text
    const text = document.createElement("p");
    text.textContent = `Reminder: ${message.name}`;
    text.style.fontSize = "16px";
    text.style.margin = "20px 0 0 0";

    // Append everything
    popup.appendChild(closeBtn);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(deleteBtn);
    popup.appendChild(text);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }
});
