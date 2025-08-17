document.getElementById('add').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const interval = parseInt(document.getElementById('interval').value.trim());

  const popupContent = document.getElementById('popup-content');

  function showMessage(message) {
    const msgElement = document.createElement('p');
    msgElement.textContent = message;
    popupContent.appendChild(msgElement);

    // Remove after 3 seconds
    setTimeout(() => {
      msgElement.remove();
    }, 3000);
  }

  if (!name || isNaN(interval)) {
    showMessage("Please enter a valid name and interval.");
    return;
  }

  if (interval < 1) {
    showMessage("Interval needs to be atleast 1");
    return;
  }

  browser.runtime.sendMessage({
    action: 'addTask',
    name,
    interval: interval
  });

  showMessage(`Reminder "${name}" added!`);
});
