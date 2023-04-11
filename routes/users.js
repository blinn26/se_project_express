const express = require("express");
const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getUsers, getUser } = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
