import webhook from "../api/webhook";
import index from "../api/index";

export default function (app) {
    app.use("/", index);
    app.use("/webhook", webhook);
}
