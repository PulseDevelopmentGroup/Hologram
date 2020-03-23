import fastify from "fastify";
import { AddressInfo } from "net";

const server = fastify({
  logger: true
});

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await server.listen(3000);
    server.log.info(
      `Server listening on ${(server.server.address() as AddressInfo)?.port}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
