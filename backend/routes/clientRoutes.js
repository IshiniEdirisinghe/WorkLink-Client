const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// Get a client
router.get("/", async (req, res) => {
  try {
    const client = await Client.findOne();
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
