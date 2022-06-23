const connection = (socket, io) => {
  console.log(socket.id, "connected");
  io.emit("hello", "hello");
};
export default connection;
