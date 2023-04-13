import fs from "fs";
import logger from "morgan";

const logFilePath = "./src/logs/";
const logFile = "./src/logs/logs.txt";

export default logger(function (tokens, req, res) {
    const date = new Date(tokens.date());
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const time = date.toLocaleTimeString() + " - " + date.toLocaleDateString();
    const status = tokens.status(req, res);
    const userAgent = req.headers["user-agent"];
    const responseTime = tokens["response-time"](req, res);
    const response = `>>>>>> ${time} ${method}[${status}]: ${url} ${responseTime}ms - ${userAgent}`;

    if (!fs.existsSync(logFilePath)) fs.mkdir(logFilePath, { recursive: true }, (err) => {});

    fs.access(logFile, fs.constants.F_OK, (err) => {
        if (err) return fs.writeFile(logFile, response, (err) => {});
        fs.appendFile(logFilePath, response + "\n", (err) => {});
    });

    return response;
});
