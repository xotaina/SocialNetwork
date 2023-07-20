const { connect, connection } = require("mongoose");

const conn = connect("mongodb://localhost:27017/socialnetwork", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection.once("open", () =>
  console.log("MongoDB database connection established successfully")
);

module.exports = connection;