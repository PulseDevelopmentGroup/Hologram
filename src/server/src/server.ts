import fastify from "fastify";
import http from "http";
import socketIo from "socket.io";
import { AddressInfo } from "net";

const server = fastify({
  logger: true,
});

const socketServer = http.createServer(server.server as any);

const io = socketIo(socketServer);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("boop", (data) => {
    console.log(data);
  });

  socket.on("join", (roomId: string) => {
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });
});

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    socketServer.listen(4001);
    await server.listen(4000);
    server.log.info(
      `Server listening on ${(server.server.address() as AddressInfo)?.port}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
