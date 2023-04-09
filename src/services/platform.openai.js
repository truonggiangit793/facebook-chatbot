import configs from "../../env.config";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({ apiKey: configs.CHAT_GPT_API_KEY });
const openai = new OpenAIApi(configuration);

const createCompletion = async function (message) {
    try {
        const completion = await openai.createCompletion({ model: "text-davinci-003", prompt: message }, { timeout: 1000 });
        return completion.data.choices[0].text;
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            return "Oops! An error occurred, please try again!";
        } else {
            console.log(error.message);
            return error.message;
        }
    }
};

export default { createCompletion };
