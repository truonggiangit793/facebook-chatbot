import { TOKEN } from "../../env.config";
import messengerPlatform from "../services/messenger.platform";
import express from "express";
const Router = express.Router();

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

Router.post("/", (req, res, next) => {
    let body = req.body;
    if (body.object === "page") {
        body.entry.forEach(async function (entry) {
            // Get the body of webhook event
            let webhook_event = entry.messaging[0];

            // Get the sender psid
            let sender_psid = webhook_event.sender.id;

            // Check if the event is a message or postback then pass it through the handler function
            if (webhook_event.message) {
                await messengerPlatform.handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                messengerPlatform.handlePostback(sender_psid, webhook_event.postback);
            }
        });
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        return res.sendStatus(404);
    }
});

export default Router;
