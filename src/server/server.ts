import path from "path";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import { AddressInfo } from "net";
import { ApolloServer, gql, IResolvers, PubSub } from "apollo-server-fastify";

const pubsub = new PubSub();
const SCREEN_ADDED = "SCREEN_ADDED";
const SCREEN_TOGGLED = "SCREEN_TOGGLED";

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
    screen(name: String!): Screen
  }

  type Mutation {
    addScreen(name: String, content: String): Screen
    toggleScreen(name: String!, open: Boolean!): Screen
  }

  type Subscription {
    screenAdded: Screen
    screenToggled(name: String!): Screen
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
    screen: (parent, { name }) => {
      return screens.find(
        (screen) => screen.name.toLowerCase() === name.toLowerCase()
      );
    },
  },
  Mutation: {
    addScreen: (parent, { name, content }) => {
      console.log(parent, name, content);

      const newScreen = {
        name,
        content,
        open: false,
      };

      pubsub.publish(SCREEN_ADDED, { screenAdded: newScreen });

      screens.push(newScreen);

      return newScreen;
    },
    toggleScreen: (parent, { name, open }) => {
      const screen = screens.find((screen) => screen.name === name);

      if (screen) {
        screen.open = open;

        pubsub.publish(SCREEN_TOGGLED, { screenToggled: screen });

        return screen;
      }
    },
  },
  Subscription: {
    screenAdded: {
      subscribe: () => pubsub.asyncIterator([SCREEN_ADDED]),
    },
    screenToggled: {
      subscribe: () => pubsub.asyncIterator([SCREEN_TOGGLED]),
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
    this.httpServer.register(server.createHandler(), {
      subscription: true,
    });
    server.installSubscriptionHandlers(this.httpServer.server);

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
