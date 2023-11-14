// // import net from "net";
// // const PORT = 5732;
// // const server = net.createServer((socket) => {
// //   console.log("client connected");
// //   socket.on("data", (data) => {
// //     console.log("Received Data", data);

// //     socket.write("Hello, Client!");
// //   });
// //   socket.on("end", () => {
// //     console.log("client disconnected");
// //   });
// // });
// // server.listen(PORT, () => {
// //   console.log(`Server listening on  port ${PORT}`);
// // });
// const WebSocket = require("ws");
// const http = require("http");
// const express = require("express");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Serve static files
// app.use(express.static(path.join(__dirname, "public")));
// wss.on("connection", (ws) => {
//   // Connection is established
//   console.log("Client connected");

//   // Listen for messages from clients
//   ws.on("message", (message) => {
//     try {
//       const data = JSON.parse(message);

//       if (data.type === "chat") {
//         // Broadcast the message to all clients
//         wss.clients.forEach((client) => {
//           if (client !== ws && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//           }
//         });
//       } else if (data.type === "setUsername") {
//         // Set the username for the client
//         ws.username = data.username;
//         sendUserList();
//       }
//     } catch (error) {
//       console.error("Error parsing message:", error);
//     }
//   });

//   // Listen for the connection to be closed
//   ws.on("close", () => {
//     console.log("Client disconnected");
//     sendUserList();
//   });
// });

// // Start the server
// const PORT = 3532;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Keep track of connected clients and their usernames
const clients = new Set();

function sendUserList() {
  const userList = Array.from(clients).map((client) => client.username);
  const data = {
    type: "userList",
    users: userList,
  };

  // Broadcast the updated user list to all clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  // Connection is established
  console.log("Client connected");

  // Add the new client to the set of clients
  clients.add(ws);

  // Listen for messages from clients
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("data", data);

      if (data.type === "chat") {
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
          if (client !== ws) {
            client.send(JSON.stringify(data));
          }
        });
      } else if (data.type === "setUsername") {
        // Set the username for the client
        ws.username = data.username;
        console.log("ws.username", ws.username);
        sendUserList();
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  // Listen for the connection to be closed
  ws.on("close", () => {
    console.log("Client disconnected");

    // Remove the client from the set of clients
    clients.delete(ws);

    // Notify all clients about the updated user list
    sendUserList();
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Start the server
const PORT = 3532;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
