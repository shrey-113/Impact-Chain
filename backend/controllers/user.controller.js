const {User} = require("../models"); // Adjust the path as necessary

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const { type, walletAddress } = req.body;

    // Validate required fields
    if (!type || !walletAddress) {
      return res
        .status(400)
        .json({ message: "Type and walletAddress are required." });
    }

    // Create the user
    const newUser = await User.create({ type, walletAddress });

    res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while creating the user.",
        error: error.message,
      });
  }
};

// Get a user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching the user.",
        error: error.message,
      });
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching users.",
        error: error.message,
      });
  }
};

// Get users by type
const getUserByTypes = async (req, res, next) => {
  try {
    const { type } = req.params;

    // Validate type
    if (!["ngo", "contributor"].includes(type)) {
      return res
        .status(400)
        .json({
          message: "Invalid user type. Must be 'ngo' or 'contributor'.",
        });
    }

    // Find users by type
    const users = await User.find({ type });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching users by type.",
        error: error.message,
      });
  }
};

// Export all controllers
module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  getUserByTypes,
};
