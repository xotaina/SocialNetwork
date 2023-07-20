const Thought = require('../models/Thought');
const User = require('../models/User');

// Centralized error handling
const handleError = (res, err, message = 'An error occurred') => {
  console.error(err);
  res.status(500).json({ message, error: err });
}

// User Controllers
const userController = {
  // Get All Users
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      handleError(res, err);
    }
  },

  // Get Single User
  getSingleUser: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      user
        ? res.json(user)
        : res.status(404).json({ message: 'No user with that ID' });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Create a User
  createUser: async (req, res) => {
    try {
      const user = await User.create({
        username: req.body.username,
        email: req.body.email
      });

      res.json(user);
    } catch (err) {
      handleError(res, err);
    }
  },

  // Update a User
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          username: req.body.username,
          email: req.body.email,
        },
        { new: true }
      );

      updatedUser
        ? res.json(updatedUser)
        : res.status(404).json({ message: "No user found with that ID" });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Delete a User
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      const thoughts = await Thought.deleteMany({ username: user.username });

      thoughts
        ? res.json(user)
        : res.status(404).json({ message: 'No thoughts for that user' });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Add Friend to a User
  addFriend: async (req, res) => {
    try {
      const friend = await User.findOne({ _id: req.params.friendId }).select('-__v');

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $addToSet: {
            friends: friend._id
          }
        },
        { new: true }
      );

      user
        ? res.json(user)
        : res.status(404).json({ message: 'No user with that ID' });
    } catch (err) {
      handleError(res, err);
    }
  },

  // Remove Friend from a User
  deleteFriend: async (req, res) => {
    try {
      const friend = await User.findOne({ _id: req.params.friendId }).select('-__v');

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $pull: {
            friends: friend._id
          }
        },
        { new: true }
      );

      user
        ? res.json(user)
        : res.status(404).json({ message: 'No user with that ID' });
    } catch (err) {
      handleError(res, err);
    }
  }
};

module.exports = userController;
