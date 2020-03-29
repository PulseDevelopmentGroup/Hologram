const Server = require("./dist/server").default;

const s = new Server("0.0.0.0", 4000, 4001, undefined);
s.start();
