import request from "request";
import configs from "../../env.config";
import platformOpenAI from "./platform.openai";

const handlePostback = function (sender_psid, receive_postback) {};

const callSendAPI = function (sender_psid, response) {
    // Construct the message body
    let request_body = { recipient: { id: sender_psid }, message: response };
    request(
        {
            uri: "https://graph.facebook.com/v16.0/me/messages",
            qs: { access_token: configs.PAGE_ACCESS_TOKEN },
            method: "POST",
            json: request_body,
        },
        (err, res, body) => {
            if (err) {
                console.log("Unable to send message!");
            } else {
                console.log("Message sent successfully!");
            }
        }
    );
};

const handleMessage = async function (sender_psid, receive_message) {
    // Check if the message contains text
    if (receive_message.text) {
        // Create the payload for a basic text message
        const response = await platformOpenAI.createCompletion(receive_message.text);
        // Send the response message
        callSendAPI(sender_psid, response);
    }

    // Check if the message contains attachments
    if (receive_message.attachments) {
        const response = { text: "How can I assist you today?" };
        // Send the response message
        callSendAPI(sender_psid, response);
    }
};

export default { handleMessage, handlePostback, callSendAPI };
