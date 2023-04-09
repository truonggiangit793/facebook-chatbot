import express from "express";
const Router = express.Router();

import platformOpenAI from "../services/platform.openai";

Router.get("/", (req, res, next) => {
    return res.end("Hello world!");
});

Router.get("/test/:message", async (req, res, next) => {
    const message = req.params.message;
    const response = await platformOpenAI.createCompletion(message);
    res.json(response);
});

export default Router;
