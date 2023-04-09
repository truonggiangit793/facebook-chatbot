import express from "express";
import axios from "axios";

const Router = express.Router();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || null;

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

Router.post("/", (req, res, next) => {
    let body = req.body;
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body);
    // body = {
    //     object: "page",
    //     entry: [
    //         {
    //             id: "100711156323546",
    //             time: 1681029570395,
    //             messaging: [
    //                 {
    //                     sender: { id: "5982973831786425" },
    //                     recipient: { id: "100711156323546" },
    //                     timestamp: 1681029570128,
    //                     message: {
    //                         mid: "m_KZKgBVbmFolLKaXRQ_JrK_bzXB6LW-VzV4JiFJTeiYgDF3RCUZK7ds_czSCkW4oHxBY4TBHVMN-Fzq5r7QOQiA",
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
    if (body.object === "page") {
        if (body.entry[0].messaging && body.entry[0].messaging[0].message.text) {
            axios.post("https://graph.facebook.com/v16.0/100711156323546/messages?access_token=" + process.env.PAGE_ACCESS_TOKEN, {
                recipient: {
                    id: body.entry[0].messaging[0].sender.id,
                },
                messaging_type: "RESPONSE",
                message: {
                    text: "Hello, world!",
                },
            });
        }
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        return res.sendStatus(404);
    }
});

export default Router;
