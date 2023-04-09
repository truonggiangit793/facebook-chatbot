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
    console.log("\u{1F7EA} Received webhook");
    console.dir(req.body, { depth: null });
    // const bodySample = {
    //     object: "page",
    //     entry: [
    //         {
    //             id: "100711156323546",
    //             time: 1681047934362,
    //             messaging: [
    //                 {
    //                     sender: { id: "5982973831786425" },
    //                     recipient: { id: "100711156323546" },
    //                     timestamp: 1681047934086,
    //                     message: {
    //                         mid: "m_urQ6Lg-Ria_sfejXq-GMZ_bzXB6LW-VzV4JiFJTeiYjCdvBg0YZR6wUr2jptlFX7BNuqoAIdiCCKg1i1C9Ytpw",
    //                         text: "Hi",
    //                         nlp: {
    //                             intents: [],
    //                             entities: {},
    //                             traits: {
    //                                 wit$greetings: [
    //                                     {
    //                                         id: "5900cc2d-41b7-45b2-b21f-b950d3ae3c5c",
    //                                         value: "true",
    //                                         confidence: 0.9999,
    //                                     },
    //                                 ],
    //                                 wit$sentiment: [
    //                                     {
    //                                         id: "5ac2b50a-44e4-466e-9d49-bad6bd40092c",
    //                                         value: "positive",
    //                                         confidence: 0.7336,
    //                                     },
    //                                 ],
    //                             },
    //                             detected_locales: [{ locale: "vi_VN", confidence: 0.8365 }],
    //                         },
    //                     },
    //                 },
    //             ],
    //         },
    //     ],
    // };
    if (req.body.object === "page") {
        console.log(req.body.entry[0].message);
        if (req.body.entry[0].messaging && req.body.entry[0].messaging[0].recipient.id === configs.PAGE_ID) {
            if (req.body.entry[0].messaging[0].message?.text) {
                const messages = [
                    { role: "system", content: "You are a helpful assistant" },
                    { role: "user", content: req.body.entry[0].messaging[0].message.text },
                ];
                await openai
                    .createChatCompletion({ messages, model: "gpt-3.5-turbo" })
                    .then((response) => {
                        console.log("🚀 ~ file: webhook.js:37 ~ .then ~ response:", response);
                        axios.post("https://graph.facebook.com/v16.0/100711156323546/messages?access_token=" + configs.PAGE_ACCESS_TOKEN, {
                            recipient: { id: req.body.entry[0].messaging[0].sender.id },
                            messaging_type: "RESPONSE",
                            message: { text: response.choices[0].message.content },
                        });
                    })
                    .catch((error) => {
                        console.log("🚀 ~ file: webhook.js:44 ~ Router.post ~ error:", error);
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
