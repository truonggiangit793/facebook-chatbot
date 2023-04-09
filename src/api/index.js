import express from "express";
const Router = express.Router();

import { Configuration, OpenAIApi } from "openai";
import configs from "../../env.config";

const configuration = new Configuration({ apiKey: configs.CHAT_GPT_API_KEY, organization: "org-V6euAtY61X1AZhpGewtGrwZv" });
const openai = new OpenAIApi(configuration);

Router.get("/", (req, res, next) => {
    return res.end("Hello world!");
});

Router.get("/test", async (req, res, next) => {
    const messages = [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: "Hello world!" },
    ];
    const response = await openai.listEngines();
    console.dir(response, { depth: null });
    res.end("Hello");

    // await openai
    //     .createChatCompletion(
    //         { model: "text-davinci-003", prompt: "Hello world" },
    //         {
    //             timeout: 1000,
    //             headers: {
    //                 "Example-Header": "example",
    //             },
    //         }
    //     )
    //     .then((response) => {
    //         return res.json(response);
    //     })
    //     .catch((error) => {
    //         return res.json(error);
    //     });
});

export default Router;
