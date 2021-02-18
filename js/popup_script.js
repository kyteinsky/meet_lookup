//buttons
const plosButton = document.getElementById("plos");
const okayButton = document.getElementById("okay");

// text fields
const idField = document.getElementById("id");
const startField = document.getElementById("start");
const intervalField = document.getElementById("interval");

const authuserField = document.getElementById("authuser");
const wordsField = document.getElementById("words");

const fetch_meets = () => {
  chrome.storage.sync.get("meets", (result) => {
    meets = result.meets === "" ? {} : JSON.parse(result.meets);
    console.log("fetched all meets from storage");
  });
};
const set_meets = () => {
  chrome.storage.sync.set({ meets: JSON.stringify(meets) }, () => {
    console.log("set meets key in persistent storage");
  });
};
const logMeetsObject = () => {
  for (let i in meets) console.log(`${i} => ${meets[i]}`);
};

const errMsgSpan = document.getElementById("err_msg");

const appendHTML = (index, ...fields) => {
  let ul = document.createElement("ul");
  ul.id = `set_meet${index}`;
  let li = document.createElement("li");

  let delButton = document.createElement("input");
  delButton.type = "button";
  delButton.value = "X";
  delButton.className = "delete";
  delButton.id = `del${index}`;
  delButton.addEventListener("click", deleteListener, false);

  let meetId = document.createElement("span");
  meetId.innerHTML = fields[0].toLowerCase();
  let start = document.createElement("span");
  start.innerHTML = fields[1];
  let mins = document.createElement("span");
  mins.innerHTML = `${fields[2]} mins`;

  li.appendChild(meetId);
  li.appendChild(start);
  li.appendChild(mins);
  li.appendChild(delButton);

  ul.appendChild(li);

  document.getElementById("all_meets").appendChild(ul);
};

let meets = {};

chrome.storage.sync.get("meets", (result) => {
  meets = JSON.parse(result.meets);

  for (let i in meets) appendHTML(i, ...meets[i]);
});
chrome.storage.sync.get("authuser", (result) => {
  if (result.authuser) authuserField.value = result.authuser;
});
chrome.storage.sync.get("words", (result) => {
  if (result.words) wordsField.value = result.words.match(/[^,\s?]+/g);
});

// no unique ids because same meet can be scheduled twice

plosButton.addEventListener("click", () => {
  if (
    /([a-z]{3})-([a-z]{4})-([a-z]{3})/g.test(idField.value.toLowerCase()) &&
    /([01]?[0-9]|2[0-3]):[0-5][0-9]/g.test(startField.value) &&
    /([0-9]{1,})/g.test(intervalField.value)
  ) {
    errMsgSpan.innerHTML = "";
    document.querySelector("#main").style.height = "550px";
    document.querySelector("#indicator").style.top = "110px";
    document.querySelector("#indicator").style.backgroundColor = "crimson";

    meets[Object.keys(meets).length] = [
      idField.value.toLowerCase(),
      startField.value,
      intervalField.value,
    ];

    set_meets();
    logMeetsObject();

    // append to html view
    appendHTML(
      Object.keys(meets).length - 1,
      idField.value,
      startField.value,
      intervalField.value
    );

    idField.value = "";
    startField.value = "";
  } else {
    // console.error('some error in input');
    errMsgSpan.innerHTML = "check your input";
    document.getElementById("main").style.height = "570px"; // + 20px
  }
});

okayButton.addEventListener("click", () => {
  const words = wordsField.value.match(/[^,\s?]+/g);
  if (
    /([0-9]{1,2})/.test(authuserField.value) &&
    words != null &&
    meets.length != 0
  ) {
    chrome.storage.sync.set({ authuser: authuserField.value }, () => {
      console.log("authuser storage value set");
    });
    chrome.storage.sync.set({ words: words.toString() }, () => {
      console.log("words storage value set");
    });

    chrome.runtime.sendMessage({ body: "set" }, (response) => {
      console.log(`msg sent, response: ${response.msg}`);
    });
    errMsgSpan.innerHTML = "meets scheduled";
    document.querySelector("#indicator").style.backgroundColor = "forestgreen";
  } else {
    errMsgSpan.innerHTML = "check your input";
  }
  document.getElementById("main").style.height = "570px"; // + 20px
  document.querySelector("#indicator").style.top = "130px";
});

document.querySelector("#clear_all").addEventListener("click", () => {
  chrome.storage.sync.set({ meets: "{}" }, () => {
    console.log("chrome storage cleared");
    document.querySelector("#all_meets").innerHTML = "";
  });
  meets = {};
});

const deleteListener = (event) => {
  console.log(`meets before removal:`);
  logMeetsObject();
  const index = event.target.id.charAt(event.target.id.length - 1);
  event.target.parentNode.parentNode.parentNode.removeChild(
    document.querySelector(`#set_meet${index}`)
  );
  delete meets[index];
  set_meets();
  console.log(`meets after removal:`);
  logMeetsObject();
};
