const form = document.getElementById("form");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
let username = "";
if (usernameInput.value === "") {
  messageInput.setAttribute("disabled", "disabled");
}
usernameInput.addEventListener("input", () => {
  if (usernameInput.value === "") {
    messageInput.setAttribute("disabled", "disabled");
  } else {
    messageInput.removeAttribute("disabled");
  }
});
form.addEventListener("submit", (e) => {
  username = usernameInput.value;
  let message = messageInput.value;
  e.preventDefault();
  if (username !== "") {
    const usernameContainer = document.getElementById("username");
    usernameContainer.innerHTML = username;
  }
  if (username && message) {
    usernameInput.setAttribute("readonly", "readonly");
    usernameInput.style.display = "none";
    usernameAndMessage(username, message);
    messageInput.value = "";
  } else if (username) {
    changeUsername(username);
    usernameInput.setAttribute("readonly", "readonly");
    usernameInput.style.display = "none";
  } else {
    sendMessage(message);
    messageInput.value = "";
  }
  const chat = document.getElementById("chat");
  chat.scrollTop = chat.scrollHeight;
  chat.scrollTop = chat.scrollHeight;
});
const socket = new WebSocket("ws://localhost:3532");

socket.addEventListener("open", (event) => {
  console.log("Connected to the server");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "chat") {
    displayChatMessage(data);
  }
});

function displayChatMessage(data) {
  const chatDiv = document.getElementById("chat");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message");

  // Check if the message is sent by the current user
  if (data.username === username) {
    messageDiv.classList.add("sent-message");
  } else {
    messageDiv.classList.add("received-message");
  }

  const timestamp = new Date().toLocaleTimeString();
  messageDiv.innerHTML = `<span class="username">${data.username}</span> (${timestamp}): <span class="message-text">${data.message}</span>`;
  chatDiv.appendChild(messageDiv);

  // Scroll to the bottom of the chat to show the latest message
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function sendMessage(message) {
  if (message) {
    const data = {
      type: "chat",
      username,
      message,
    };
    displaySystemMessage(message);
    socket.send(JSON.stringify(data));
  }
}

function changeUsername(username) {
  if (username) {
    const data = {
      type: "setUsername",
      username,
    };
    socket.send(JSON.stringify(data));
  }
}
function usernameAndMessage(username, message) {
  if (username && message) {
    const data = {
      type: "chat",
      username,
      message,
    };

    displaySystemMessage(message);
    socket.send(JSON.stringify(data));
  }
}

function displaySystemMessage(message) {
  console.log(message);
  const timestamp = new Date().toLocaleTimeString();

  const chatDiv = document.getElementById("chat");
  const systemMessageDiv = document.createElement("div");
  systemMessageDiv.classList.add("system-message", "chat-message");
  systemMessageDiv.textContent = `${timestamp}: ${message}`;
  chatDiv.appendChild(systemMessageDiv);
}
// Change Background
const images = [
  "../images/1.jpg",
  "../images/2.jpg",
  "../images/3.jpg",
  "../images/4.jpg",
  "../images/5.jpg",
  "../images/6.png",
  "../images/7.png",
  "../images/8.png",
];

const toggle = document.querySelector(".toggle");
const modal = document.querySelector(".modal");
const box = document.querySelector(".box");
document.addEventListener("click", (e) => {
  if (e.target.closest(".toggle")) {
    modal.classList.toggle("open");
  }
});
function renderImages(array) {
  modal.innerHTML = "";
  array.forEach((item) => {
    modal.innerHTML += `
    <div class="box">
    <img src="${item}" />
    </div>
    `;
  });
  const boxImages = document.querySelectorAll(".box img");
  boxImages.forEach((item) => {
    console.log(item);
    item.addEventListener("click", (e) => {
      const currentSrc = e.currentTarget.src.split("80/")[1];
      document.body.style.backgroundImage = `url(/${currentSrc})`;
    });
  });
}
renderImages(images);
