const development = require("./development");
const production = require("./production");

let env = development;
if (process.env.NODE_ENV === "production") {
    env = production;
}
process.env.NODE_ENV

module.exports = env;