import request from "request";
import configs from "../../env.config";

const handlePostback = function (sender_psid, receive_postback) {};

const callSendAPI = function (sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: { id: sender_psid },
        message: response,
    };
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

const handleMessage = function (sender_psid, receive_message) {
    let response;

    // Check if the message contains text
    if (receive_message.text) {
        // Create the payload for a basic text message
        response = { text: `You sent me a message: "${receive_message.text}". Now send me an image!` };
    }

    // Send the response message
    callSendAPI(sender_psid, response);
};

export default { handleMessage, handlePostback, callSendAPI };
