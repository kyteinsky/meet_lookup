let okayButton = document;

// // The wake lock sentinel.
// let wakeLock = null;

// // Function that attempts to request a wake lock.
// const requestWakeLock = async () => {
//   try {
//     wakeLock = await navigator.wakeLock.request('screen');
//     wakeLock.addEventListener('release', () => {
//       console.log('Wake Lock was released');
//     });
//     console.log('Wake Lock is active');
//   } catch (err) {
//     console.error(`${err.name}, ${err.message}`);
//   }
// };

let schedules = {};
// schedules = {}; // I don't remember what I was to going to change it to
authuser = "";
words = [];
meets = {}; //init

const openMeetTab = (meetDetails) => {
  chrome.tabs.create(
    {
      url: `https://meet.google.com/${meetDetails[0]}?authuser=${authuser}&drn=${meetDetails[2]}`,
      active: true,
      selected: true // mic btn doesn't show up unless tab is focused
    },
    (tab) => {
      console.log(`opened the meet tab=${JSON.stringify(tab)}`);
      chrome.tabs.executeScript(tab.id, { file: "js/script.js" }, (res) => {
        console.log(`script injected: ${JSON.stringify(res)}`);
        // mute the tab
        chrome.tabs.update(tab.id, { muted: true });
      });
    }
  );
};

const scheduleMeet = ({ i: i, meetDetails: meetDetails }) => {
  // [meetId, time, duration]
  const now = new Date();
  let millisTillMeet =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...meetDetails[1].split(":"),
      0,0
    ) - now;
  if (millisTillMeet < 0) millisTillMeet += 86400000;
  schedules[i] = setTimeout(() => {
    openMeetTab(meetDetails);
  }, 0); // for debugging
  // }, millisTillMeet)
};

// all listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.body === "set") {
    for (let i in schedules) {
      clearTimeout(schedules[i]);
    }
    schedules = {};
    authuser = "";
    words = [];
    meets = {}; // reset everything

    console.log("msg received!");
    sendResponse({ msg: "done" });

    chrome.storage.sync.get("meets", (res) => {
      meets = JSON.parse(res.meets) || {};
    });
    chrome.storage.sync.get("authuser", (res) => {
      authuser = res.authuser;
    });
    chrome.storage.sync.get("words", (res) => {
      words = res.words.match(/[^,\s?]+/g);
      for (let i in meets) {
        scheduleMeet({
          i: i,
          meetDetails: meets[i],
        });
      }
    });
  } else if (message.body.includes("authuser")) {
    const failedMeetId = message.body.split(" ")[2]
    console.log(`failedMeetId=${failedMeetId}`);
    for (let i in schedules) {
      clearTimeout(schedules[i]);
		}
		chrome.storage.sync.get("authuser", (res) => {
      authuser = res.authuser;
      console.log(`authuser===${authuser}`);
    });
		schedules = {};
		let fId = 0 // almost all the times this will remain zero, yet just for failsafe
    for (let i in meets) {
      if (meets[i][0] === failedMeetId){
				fId = i
				continue;
			}
      scheduleMeet({
        i: i,
        meetDetails: meets[i],
      });
    }
    openMeetTab([failedMeetId, meets[fId][1], meets[fId][2]]);
    console.log(`openMeetTab==${[failedMeetId, meets[fId][1], meets[fId][2]]}`);
    console.log(
      "opened meet tab with correct authuser for " + failedMeetId
    );
  } else if (message.body.includes("alert")) {
    const meetId = message.body.split(" ")[2]
    // notification isn't helping

    // chrome.notifications.create(meetId, {
    //   type: 'basic',
    //   title: `Meet Alert: ${meetId}`,
    //   message: `Looks like some word matched from your list in the meet conversations`,
    //   iconUrl: ''
    // },
    // () => { // callback
    //   // console.log('hello sir you might wish to look at it');
    //   console.log(chrome.runtime.lastError);
    // })

    chrome.tabs.update(sender.tab.id, {
      muted: false,
      selected: true,
      active:true
    });
    for (let i in meets) {
      if (meets[i][0] === message.body.split(" ")[2]) {
        clearTimeout(schedules[i]);
      }
    }
  }
});
