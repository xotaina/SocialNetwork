const Thought = require("../models/Thought");
const User = require("../models/User");

// Centralized error handling
const handleError = (res, err, message = 'An error occurred') => {
  console.error(err);
  res.status(500).json({ message, error: err });
}

// Thought Controllers
const thoughtController = {
  // Get All Thoughts
  getThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      handleError(res, err);
    }
  },

  // Get Single Thought
  getSingleThought: async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select("-__v")
        .populate("reactions");

      thought
        ? res.json(thought)
        : res.status(404).json({ message: "No thought with that ID" });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Create a Thought
  createThought: async (req, res) => {
    try {
      const thought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
      });

      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        {
          $addToSet: { thoughts: thought._id },
        },
        { new: true }
      );

      user
        ? res.json(user)
        : res.status(404).json({
            message: "Error creating thought - no user with that ID",
          });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Update a Thought
  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        {
          thoughtText: req.body.thoughtText,
          username: req.body.username,
        },
        { new: true }
      );

      updatedThought
        ? res.json(updatedThought)
        : res.status(404).json({ message: "No thought found with that ID" });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Delete a Thought
  deleteThought: async (req, res) => {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      user
        ? res.json({ message: "Thought successfully deleted!" })
        : res.status(404).json({
            message: "Error deleting thought",
          });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Add Reaction to a Thought
  addReaction: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      thought
        ? res.json("Reaction added")
        : res.status(404).json({ message: "No thought with this ID" });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Remove Reaction from a Thought
  removeReaction: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      thought
        ? res.json("Reaction deleted")
        : res.status(404).json({ message: "No thought with this ID" });
    } catch (err) {
      handleError(res, err);
    }
  }
};

module.exports = thoughtController;
