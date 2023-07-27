const router = require("express").Router();
const userRoutes = require("./userRoute");
const ThoughtRoutes = require("./ThoughtRoute");

router.use("/users", userRoutes);
router.use("/thoughts", ThoughtRoutes);

module.exports = router;