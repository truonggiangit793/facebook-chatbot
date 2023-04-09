import { TOKEN } from "../../env.config";
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

Router.post("/", async (req, res, next) => {
    let body = req.body;
    if (body.object === "page") {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            console.log({ webhook_event, sender_psid });
        });
        return res.status(200).send("EVENT_RECEIVED");
    } else {
        return res.sendStatus(404);
    }
});

export default Router;
