import { Configuration, OpenAIApi } from "openai";
import express from "express";
import axios from "axios";
import configs from "../../env.config";

const Router = express.Router();
const configuration = new Configuration({ apiKey: configs.CHAT_GPT_API_KEY });
const openai = new OpenAIApi(configuration);

Router.get("/", (req, res, next) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (!mode || !token) return next(new Error("Missed parameter."));
    if (mode && token) {
        if (mode === "subscribe" && token === process.env.TOKEN) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
});

Router.post("/", async (req, res, next) => {
    if (req.body.object === "page") {
        if (req.body.entry[0].messaging && req.body.entry[0].messaging[0].recipient.id === configs.PAGE_ID) {
            if (req.body.entry[0].messaging[0].message?.text) {
                const messages = [
                    { role: "system", content: "You are a helpful assistant" },
                    { role: "user", content: req.body.entry[0].messaging[0].message.text },
                ];
                await openai
                    .createChatCompletion({ messages, model: "gpt-3.5-turbo" })
                    .then((response) => {
                        axios.post("https://graph.facebook.com/v16.0/100711156323546/messages?access_token=" + configs.PAGE_ACCESS_TOKEN, {
                            recipient: { id: req.body.entry[0].messaging[0].sender.id },
                            messaging_type: "RESPONSE",
                            message: { text: response.choices[0]?.message?.content || "Hi there, this is a sample message!" },
                        });
                    })
                    .catch((error) => {
                        axios.post("https://graph.facebook.com/v16.0/100711156323546/messages?access_token=" + configs.PAGE_ACCESS_TOKEN, {
                            recipient: { id: req.body.entry[0].messaging[0].sender.id },
                            messaging_type: "RESPONSE",
                            message: { text: "Sorry! An error occur, please try again!" },
                        });
                    });
            }
        }
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        return res.sendStatus(404);
    }
});

export default Router;
