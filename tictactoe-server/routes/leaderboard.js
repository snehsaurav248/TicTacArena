import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const topPlayers = await User.find()
      .sort({ wins: -1, draws: -1 }) 
      .limit(10)
      .select("username wins draws losses -_id"); 

    res.json(topPlayers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
