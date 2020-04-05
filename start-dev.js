const Server = require("./dist/server").default;
const logger = require("pino")({
  prettyPrint: true,
});

const s = new Server("0.0.0.0", 4000, logger);
s.start();
