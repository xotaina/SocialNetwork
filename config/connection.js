const { connect, connection } = require("mongoose");

const conn = connect("mongodb://127.0.0.1:27017/networkapi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection.once("open", () =>
  console.log("MongoDB database connection established successfully")
);

module.exports = connection;