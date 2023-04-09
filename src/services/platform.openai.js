import configs from "../../env.config";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({ apiKey: configs.CHAT_GPT_API_KEY });
const openai = new OpenAIApi(configuration);

const createCompletion = async function (message) {
    try {
        const completion = await openai.createCompletion({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: message }] });
        console.log({ completion: completion.data.choices[0].text });
        return completion.data.choices[0].text;
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        return "Oops! An error occurred, please try again!";
    }
};

export default { createCompletion };
