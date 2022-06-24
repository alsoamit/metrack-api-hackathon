let discussions = new Map();

const connection = (socket, io) => {
  console.log(socket.id, "connected");
  socket.on("join", (id) => {
    socket.join(id);
  });
};
export default connection;
