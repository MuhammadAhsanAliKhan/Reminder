let tasks = [];
const MIN_IN_MS = 60000;


// interval is in minutes
function addTask(name, interval) {
  interval = interval * MIN_IN_MS
  const time = new Date();
  time.setMilliseconds(time.getMilliseconds() + interval);
  let task = { name, time, interval };
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
    tasks.forEach(task => {
      const currentTime = new Date();
      if (task.time < currentTime) {
        console.log(`Time to do ${task.name}`);

        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          browser.tabs.sendMessage(tabs[0].id, {
            action: "showReminder",
            name: task.name
          });
        });
        
        task.time.setMilliseconds(task.time.getMilliseconds() + task.interval);
      }
    });

    await sleep(MIN_IN_MS);
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'addTask') {
    console.log(`adding ${message.name}`)
    addTask(message.name, message.interval);
  }
  else if (message.action === 'removeTask') {
    removeTask(message.name);
  }
});

start();
