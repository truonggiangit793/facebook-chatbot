import webhook from "@/api/webhook";
import index from "@/api/index";
import logs from "@/api/logs";

export default function (app) {
    app.use("/", index);
    app.use("/logs", logs);
    app.use("/webhook", webhook);
}
