import path from "path";
import express from "express";
import platformOpenAI from "@/services/platform.openai";

const Router = express.Router();

Router.get("/", (req, res, next) => {
    return res.sendFile(path.join(__dirname, "../", "../", "src", "logs", "server.log"));
});

Router.get("/test/:message", async (req, res, next) => {
    const message = req.params.message;
    const response = await platformOpenAI.createCompletion(message);
    res.set({ "Content-Type": "text/plain; charset=utf-8" });
    res.write(response, "utf-8");
    res.end();
});

export default Router;
