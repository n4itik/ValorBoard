import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://valorboard-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messageBoardInDB = ref(database, "messageBoard");

const messageInputEl = document.getElementById("message-input");
const senderInputEl = document.getElementById("sender-input");
const receiverInputEl = document.getElementById("receiver-input");
const sendButtonEl = document.getElementById("send-button");
const messageBoardEl = document.getElementById("message-board");

sendButtonEl.addEventListener("click", function () {
  let messageValue = messageInputEl.value.trim();
  let senderValue = senderInputEl.value.trim();
  let receiverValue = receiverInputEl.value.trim();

  if (messageValue != "" && senderValue != "" && receiverValue != "") {
    let messageObject = {
      message: messageValue,
      sender: senderValue,
      receiver: receiverValue,
    };

    push(messageBoardInDB, messageObject);
    clearInput();
  }
});

onValue(messageBoardInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearMessageBoardEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      appendItemToMessageBoardEl(currentItem);
    }
  } else {
    messageBoardEl.innerHTML = `<p style="margin:0 auto">No messages here.. yet</p>`;
  }
});

function clearMessageBoardEl() {
  messageBoardEl.innerHTML = "";
}

function clearInput() {
  messageInputEl.value = "";
  senderInputEl.value = "";
  receiverInputEl.value = "";
}

function appendItemToMessageBoardEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newListEl = document.createElement("li");

  let newReceiver = document.createElement("p");
  let newSender = document.createElement("p");
  let newMessage = document.createElement("p");

  newReceiver.textContent = `To ${itemValue.receiver}`;
  newMessage.textContent = itemValue.message;
  newSender.textContent = `From ${itemValue.sender}`;

  newListEl.append(newReceiver, newMessage, newSender);

  messageBoardEl.append(newListEl);
}
