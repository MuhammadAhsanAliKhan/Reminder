function createElement(tag, attrs = {}, styles = {}) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  Object.assign(el.style, styles);
  return el;
}

function showReminder(name, recurring = true) {
  if (document.getElementById("reminder-overlay")) return;

  const overlay = createElement("div", {
    id: "reminder-overlay",
    class: "reminder-overlay",
    role: "dialog",
    "aria-modal": "true"
  });

  const popup = createElement("div", {
    class: "reminder-popup",
    tabindex: "-1"
  });

  const closeBtn = createElement("span", {
    "aria-label": "Close reminder",
    class: "reminder-close",
    tabIndex: "0"
  });
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => overlay.remove();
  closeBtn.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") overlay.remove();
  };

  const deleteBtn = createElement("button", {
    class: "reminder-delete"
  });
  deleteBtn.textContent = "Delete Reminder";
  deleteBtn.onclick = () => {
    browser.runtime.sendMessage({ action: "removeTask", name });
    overlay.remove();
  };

  const text = createElement("p", {
    class: "reminder-text"
  });
  text.textContent = `Reminder: ${name}`;

  popup.appendChild(closeBtn);
  popup.appendChild(text);
  if (recurring) {
    popup.appendChild(deleteBtn);
  }
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Focus popup for accessibility
  popup.focus();

  // Close on Escape key
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.remove();
  });
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "showReminder") {
    showReminder(message.name, message.recurring);
  }
});