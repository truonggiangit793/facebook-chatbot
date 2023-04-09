import express from "express";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const Router = express.Router();
const { PAGE_ACCESS_TOKEN, TOKEN, CHAT_GPT_API_KEY } = process.env;
const configuration = new Configuration({ apiKey: CHAT_GPT_API_KEY });
const openai = new OpenAIApi(configuration);

Router.get("/", (req, res, next) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (!mode || !token) return next(new Error("Missed parameter."));
    if (mode && token) {
        if (mode === "subscribe" && token === TOKEN) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
});

Router.post("/", async (req, res, next) => {
    let body = req.body;
    console.log(`\u{1F7EA} Received webhook ============================================`);
    console.dir(body, { depth: true });
    if (body.object === "page") {
        if (body.entry[0].messaging && body.entry[0].messaging[0].message.text) {
            const messages = [
                { role: "system", content: "You are a helpful assistant" },
                { role: "user", content: body.entry[0].messaging[0].message.text },
            ];
            const response = await openai.createChatCompletion({ messages, model: "gpt-3.5-turbo" });
            axios.post("https://graph.facebook.com/v16.0/100711156323546/messages?access_token=" + PAGE_ACCESS_TOKEN, {
                recipient: { id: body.entry[0].messaging[0].sender.id },
                messaging_type: "RESPONSE",
                message: { text: response },
            });
        }
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        return res.sendStatus(404);
    }
});

export default Router;
