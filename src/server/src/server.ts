import fastify from "fastify";
import http from "http";
import socketIo from "socket.io";
import { AddressInfo } from "net";

export default class Server {
  address: string;
  httpPort: number;
  socketPort: number;

  private httpServer: fastify.FastifyInstance;
  private socketServer: http.Server;
  private io: socketIo.Server;

  constructor(address: string, httpPort: number, socketPort: number) {
    this.address = address; // TODO: Setup server to bind to address
    this.httpPort = httpPort;
    this.socketPort = socketPort;

    this.httpServer = fastify({
      logger: true,
    });
    this.socketServer = http.createServer(this.httpServer.server as any);
    this.io = socketIo(this.socketServer);

    this.io.on("connection", (socket) => {
      console.log("user connected");
    });

    this.httpServer.get("/", async (request, reply) => {
      return { hello: "world" };
    });
  }

  start = async () => {
    try {
      this.socketServer.listen(this.socketPort);
      await this.httpServer.listen(this.httpPort);
      this.httpServer.log.info(
        `Server listening on ${
          (this.httpServer.server.address() as AddressInfo)?.port
        }`
      );
    } catch (err) {
      this.httpServer.log.error(err);
      process.exit(1);
    }
  };

  stop() {
    this.httpServer.log.info(
      `Server going down due to user-triggered stop command.`
    );

    this.socketServer.close();
    this.httpServer.close();
  }

  restart() {
    this.httpServer.log.info(
      `Server restarting due to user-triggered restart command.`
    );

    this.stop();
    this.start();
  }
}

const s = new Server("0.0.0.0", 4001, 4000);
s.start();
