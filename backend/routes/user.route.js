const express = require('express');
const router = express.Router();
const {userController} = require("../controllers"); // Adjust path as necessary

router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById);
router.get("/users", userController.getAllUsers);
router.get("/users/type/:type", userController.getUserByTypes);

module.exports = router;

