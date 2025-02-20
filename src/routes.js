import express from "express";
import { processMessage } from "./services/messageProcessor.js";

const router = express.Router();

router.post("/modify-message", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const modifiedMessage = await processMessage(message);
        res.json({ modifiedMessage });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
