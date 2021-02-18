console.log(`here in scirpt.js`);


setTimeout(() => {
	let words = [];

  console.log(`if part`);

  const micBtn = document.querySelector(
    "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > div > div > div > div"
  );

  const vidBtn = document.querySelector(
    "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div > div > div > div:nth-child(4) > div:nth-child(2) > div > div"
  );
  console.log(`two ====================`);
  console.log(micBtn.className.split(" ").sort().toString());

  if (
    micBtn.className.split(" ").sort().toString() ===
    "HNeRed,JRY2Pb,QmxbVb,U26fgb,kpROve,mUbCce,uJNmj"
      .split(" ")
      .sort()
      .toString()
  ) {
    micBtn.click();
  }
  console.log(`three ====================`);
  if (
    vidBtn.className.split(" ").sort().toString() ===
    "HNeRed,JRY2Pb,QmxbVb,U26fgb,kpROve,mUbCce,uJNmj"
      .split(" ")
      .sort()
      .toString()
  ) {
    vidBtn.click();
  }
  console.log(`four ====================`);

  const joinNow = document.querySelector(
    "#yDmH0d > c-wiz > div > div > div:nth-child(8) > div:nth-child(3) > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1)"
  );

	// only for organizations with gsuite
  if (joinNow.lastChild.firstChild.innerText !== 'Join now') {
  	const authuser = prompt('Enter correct authuser:')
		chrome.storage.sync.set({"authuser": authuser})
		console.log(`authuser=${authuser}`);
  	chrome.runtime.sendMessage({'body': `authuser incorrect ${document.title.split(' ')[2]}`})
  	// window.close()
  }

  joinNow.click();
  console.log(`five ====================`);

  // wait for page to load up and look for the element
  setTimeout(() => {
    const captionsButton = document.querySelector(
      "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(2)"
    );

    // turn on captions if not already
    if (captionsButton.className === "Q8K3Le") {
      captionsButton.firstChild.click();
    }

    // show chat window
    document
      .querySelector(
        "#ow3 > div > div > div:nth-child(8) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3)"
      )
      .click();
		console.log(`six ====================`);
		
		function processInput(text) {
			const wordsCaptured = text
          .toLowerCase()
          .match(/[a-z]{1,}/g);
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

    // start capturing
    const chatBoxObserver = new MutationObserver((mutations) => {
      mutations.forEach((record) => {
        console.log(record.target.lastChild.innerText);
        processInput(record.target.lastChild.innerText)
      });
    });
    const captionObserver = new MutationObserver((mutations) => {
      mutations.forEach((record) => {
				console.log(record.target.innerText);
				processInput(record.target.innerText)
      });
    });
    console.log(`seven ====================`);

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
    }, 2000);
    console.log(`eight ====================`);

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
    }, 2500);

    chrome.storage.sync.get("words", (res) => {
      if (res.words) {
        words = res.words.match(/[^,\s?]+/g);
      }
    });
  }, 5000);
	console.log(`done ====================`);
	
	const params = new URLSearchParams(location.search);

	// trigger to end meet
	closeTrigger = setTimeout(() => {
		window.close()
	}, params.get('drn')*60*1000); // mins to ms
}, 5000);

