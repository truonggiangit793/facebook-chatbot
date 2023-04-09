import express from "express";
const Router = express.Router();

import { Configuration, OpenAIApi } from "openai";
import configs from "../../env.config";

const configuration = new Configuration({ apiKey: configs.CHAT_GPT_API_KEY });
const openai = new OpenAIApi(configuration);

Router.get("/", (req, res, next) => {
    return res.end("Hello world!");
});

Router.get("/test/:message", async (req, res, next) => {
    const parameter = req.params.message;
    const messages = [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: parameter },
    ];
    await openai
        .createChatCompletion({ messages, model: "gpt-3.5-turbo" })
        .then((response) => {
            console.log("🚀 ~ file: index.js:23 ~ .then ~ response:");
            console.dir(response, { depth: null });
            res.json(response.data.choices[0].message.content);
        })
        .catch((error) => {
            console.log("🚀 ~ file: index.js:26 ~ Router.get ~ error:", error);
            res.json(error);
        });
});

export default Router;
