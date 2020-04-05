import path from "path";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import { AddressInfo } from "net";
import { ApolloServer, gql, IResolvers } from "apollo-server-fastify";

const typeDefs = gql`
  type Screen {
    name: String
    # might need this if we want custom paths?
    # slug: String
    content: String
    open: Boolean
  }

  type Query {
    screens: [Screen]
  }

  type Mutation {
    addScreen(name: String, content: String): Screen
  }
`;

const screens = [
  {
    name: "Room 1",
    content: "This is room 1",
    open: false,
  },
  {
    name: "Bottom Half",
    content: "Blah blah yak yak",
    open: false,
  },
];

const resolvers: IResolvers = {
  Query: {
    screens: () => screens,
  },
  Mutation: {
    addScreen: (parent, { name, content }) => {
      console.log(parent, name, content);

      const newScreen = {
        name,
        content,
        open: false,
      };

      screens.push(newScreen);

      return newScreen;
    },
  },
};

export default class Server {
  address: string;
  httpPort: number;

  private httpServer: fastify.FastifyInstance;

  constructor(address: string, httpPort: number, log: any) {
    this.address = address;
    this.httpPort = httpPort;

    this.httpServer = fastify({
      logger: log,
    });

    const server = new ApolloServer({ typeDefs, resolvers });
    this.httpServer.register(server.createHandler());

    this.httpServer.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
      wildcard: false,
    });

    this.httpServer.setNotFoundHandler((req, res) => {
      res.sendFile("index.html");
    });
  }

  start = async () => {
    try {
      await this.httpServer.listen(this.httpPort, this.address);
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

  // TODO: Get stop and restart working
  stop() {
    this.httpServer.log.info(
      `Server going down due to user-triggered stop command.`
    );

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
