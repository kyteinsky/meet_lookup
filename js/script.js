console.log(`here in scirpt.js`);

// wait fn
function waitForElement(querySelector, timeout = 0) {
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      if (document.querySelector(querySelector)) {
        console.log(`found element`);
        clearInterval(timer);
        resolve();
      } else if (timeout && now - startTime >= timeout) {
        clearInterval(timer);
        reject();
      }
    }, 400);
  });
}



// ==================== HELPER FUNCTIONS ========================= //

// mute mic and turn off camera
function blockAllInputs() {
  setTimeout(() => {
    const micBtn = document.querySelector(
      "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > div > div > div > div"
    );
  
    const vidBtn = document.querySelector(
      "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > div:nth-child(2) > div > div"
    );

    // const micBtn = document.querySelector("#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div > div > div > div")

    // const vidBtn = document.querySelector("#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(3) > div > div ")
  
    if (
      micBtn.className.split(" ").sort().toString() ===
      "HNeRed,JRY2Pb,QmxbVb,U26fgb,kpROve,mUbCce,uJNmj"
        .split(" ")
        .sort()
        .toString()
    ) {
      micBtn.click();
    }
    if (
      vidBtn.className.split(" ").sort().toString() ===
      "HNeRed,JRY2Pb,QmxbVb,U26fgb,kpROve,mUbCce,uJNmj"
        .split(" ")
        .sort()
        .toString()
    ) {
      vidBtn.click();
    }
  }, 500);
}

function joinMeet() {
  setTimeout(() => {
    const joinNow = document.querySelector(
      "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > span > span"
    );
    
    console.log(`00==${joinNow.innerText}`);
    // only for organizations with gsuite
    if (joinNow.innerText !== 'Join now') {
      const authuser = prompt('Enter correct authuser:')
      chrome.storage.sync.set({ authuser: authuser }, 
        () => console.log(`authuser set`)
      )
      console.log(`authuser=${authuser}`);
      document.querySelector('#yDmH0d').innerHTML = '<h1>Just wait 5 seconds...</h1>'
      setTimeout(() => {
        chrome.runtime.sendMessage({'body': `authuser incorrect ${document.title.split(' ')[2]}`})
        // window.close()
      }, 5000);
    }
  
    joinNow.parentElement.parentElement.firstChild.click();
  }, 2000);
}

function activateLookup() {
  setTimeout(() => {
    const captionsButton = document.querySelector(
      "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(2)"
    );

    // turn on captions if not already
    if (captionsButton.className === "Q8K3Le") {
      captionsButton.firstChild.click();
    }

    // show chat window
    document.querySelector(
        "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3)"
      )
      .click();
    
    const lastCharsCount = 30
    
    async function processInput(text) {
      let wordsCaptured = '' // to avoid any null errors
      
      try {
        wordsCaptured = text
          .slice(
            Math.max(text.length-lastCharsCount, 0),
            text.length
          )
          .match(/[a-zA-Z0-9]{1,}/g)
          .toLowerCase()
          // .pop()
        wordsCaptured = wordsCaptured
          .slice(
            Math.max(wordsCaptured.length-3, 0),
            wordsCaptured.length
          )
        console.log(wordsCaptured)


        for (i of words) {
          if (wordsCaptured.includes(i)) {
            chrome.runtime.sendMessage({
              body: `alert ${document.title.split(" ")[2]}`,
            });
            // disconnect observers
            chatBoxObserver.disconnect();
            captionObserver.disconnect();
            // prevent autoclose
            clearTimeout(closeTrigger)
            alert("triggered".toUpperCase());
          }
        }
      }
      catch (e) {
        console.log(`err => ${e}`);
      }
    }

    // start capturing
    const chatBoxObserver = new MutationObserver((mutations) => {
      mutations.forEach((record) => {
        // console.log(record.target.lastChild.innerText);
        processInput(record.target.lastChild.innerText)
      });
    });
    const captionObserver = new MutationObserver((mutations) => {
      mutations.forEach((record) => {
				// console.log(record.target.innerText);
				processInput(record.target.innerText)
      });
    });

    setTimeout(() => {
      chatBoxObserver.observe(
        document.querySelector(
          "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span:nth-child(2) > div > div:nth-child(2)"
        ),
        {
          childList: true,
          subtree: true,
        }
      );
    }, 1000);

    setTimeout(() => {
      captionObserver.observe(
        document.querySelector(
          "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(6)"
        ),
        {
          childList: true,
          subtree: true,
        }
      );
    }, 1500);

    chrome.storage.sync.get("words", (res) => {
      if (res.words) {
        words = res.words.match(/[^,\s?]+/g);
      }
    });


	const params = new URLSearchParams(location.search);

	// trigger to end meet
	closeTrigger = setTimeout(() => {
		window.close()
  }, params.get('drn')*60*1000); // mins to ms
  
  }, 2000);
}


// ^^^^^^^^^^^^^^^^^^^^^^^^ WATCHERS ^^^^^^^^^^^^^^^^^^^^^^^^ //
// wait for vid btn to appear
waitForElement(
  "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > div:nth-child(2)",
  20000 // max 20 secs wait
)
  .then(() => blockAllInputs())
  .catch(() => {
    alert('Timed out waiting for your mic button')
  })
// wait for join now | ask btn to appear
waitForElement(
  "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > span > span",
  20000 // max 20 secs wait
)
  .then(() => joinMeet())
  .catch(() => {
    alert('Timed out waiting for your Join button')
  })
// wait for page to load | captions btn to appear
waitForElement(
  "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(2)",
  20000 // max 20 secs wait
)
  .then(() => activateLookup())
  .catch(() => {
    alert('Timed out waiting for your page')
  })
