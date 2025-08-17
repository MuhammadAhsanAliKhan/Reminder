let tasks = [];
const MIN_IN_MS = 60000;


// interval is in minutes
function addTask(name, interval, recurring = true) {
  const intervalMs = interval * MIN_IN_MS;
  const time = new Date(Date.now() + intervalMs);
  const task = { name, time, interval: intervalMs, recurring };
  tasks.push(task);
}

function removeTask(name) {
  tasks = tasks.filter(task => task.name !== name);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
  while (true) {
    tasks.forEach((task, idx) => {
      const currentTime = new Date();
      if (task.time < currentTime) {

        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          browser.tabs.sendMessage(tabs[0].id, {
            action: "showReminder",
            name: task.name,
            recurring: task.recurring
          });
        });
        
        if (task.recurring) {
          // Schedule next reminder
          task.time = new Date(currentTime.getTime() + task.interval);
        } else {
          // Remove non-recurring task after showing
          tasks.splice(idx, 1);
        }      
      }
    });

    await sleep(MIN_IN_MS);
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'addTask') {
    console.log(`adding ${message.name}`)
    addTask(message.name, message.interval, message.recurring);
  }
  else if (message.action === 'removeTask') {
    removeTask(message.name);
  }
});

start();
