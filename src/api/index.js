import express from "express";
const Router = express.Router();

import platformOpenAI from "@/services/platform.openai";

Router.get("/", (req, res, next) => {
    return res.end("Hello world!");
});

Router.get("/test/:message", async (req, res, next) => {
    const message = req.params.message;
    const response = await platformOpenAI.createCompletion(message);
    res.set({ "Content-Type": "text/plain; charset=utf-8" });
    res.write(response, "utf-8");
    res.end();
});

export default Router;
