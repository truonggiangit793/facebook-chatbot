require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    TOKEN: process.env.TOKEN,
    CHAT_GPT_API_KEY: process.env.CHAT_GPT_API_KEY,
    PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
};
