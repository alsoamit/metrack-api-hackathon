const connection = (socket) => {
    console.log(socket.id, "connected");
    socket.on("join", (id) => {
        socket.join(id);
    });
};
export default connection;
