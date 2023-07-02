#!/usr/bin/env node

/**
 * Module dependencies.
 */

import "reflect-metadata";
import app from "./app";
var debug = require("debug")("socketio-server:server");
import * as http from "http";
import socketServer from "./socket";

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "9000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

const io = socketServer(server);

io.on("connection", (socket) => {
    console.log("New connection from " + socket.id)

    socket.on("join_room", (data) => {
      socket.join(data)
      console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id)
    })

    socket.on("send_move", (data) => {
      socket.to(data.room).emit("received_move", data)
    })
});

io.listen(9000);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);

  console.log("Server Running on Port: ", port);
}